<?php

namespace Tests\Feature;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_with_valid_credentials(): void
    {
        Admin::create([
            'name' => 'Admin',
            'email' => 'admin@casamento.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/admin/login', [
            'email' => 'admin@casamento.com',
            'password' => 'password',
        ])->assertOk()->assertJsonStructure(['admin', 'token']);
    }

    public function test_admin_login_fails_with_invalid_credentials(): void
    {
        Admin::create([
            'name' => 'Admin',
            'email' => 'admin@casamento.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/admin/login', [
            'email' => 'admin@casamento.com',
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    public function test_guest_token_cannot_access_admin_routes(): void
    {
        $guest = \App\Models\Guest::create(['name' => 'Joao', 'phone' => '11999998888']);

        $this->actingAs($guest, 'guest')
            ->getJson('/api/admin/rsvps')
            ->assertUnauthorized();
    }

    public function test_admin_token_expires_after_the_configured_window(): void
    {
        config(['auth.admin_token_ttl' => 120]);

        Admin::create([
            'name' => 'Admin',
            'email' => 'admin@casamento.com',
            'password' => 'password',
        ]);

        $token = $this->postJson('/api/admin/login', [
            'email' => 'admin@casamento.com',
            'password' => 'password',
        ])->assertOk()->json('token');

        $header = ['Authorization' => "Bearer {$token}"];

        // Dentro das 2 horas o painel continua acessivel.
        $this->travel(119)->minutes();
        $this->getJson('/api/admin/me', $header)->assertOk();

        // O guard guarda o usuario ja resolvido; em producao cada requisicao
        // e um processo novo, entao aqui precisamos limpar na mao.
        $this->app['auth']->forgetGuards();

        // Passadas as 2 horas o token deixa de ser aceito.
        $this->travel(2)->minutes();
        $this->getJson('/api/admin/me', $header)->assertUnauthorized();
    }

    public function test_login_reports_when_the_session_expires(): void
    {
        config(['auth.admin_token_ttl' => 120]);

        Admin::create([
            'name' => 'Admin',
            'email' => 'admin@casamento.com',
            'password' => 'password',
        ]);

        $expiresAt = $this->postJson('/api/admin/login', [
            'email' => 'admin@casamento.com',
            'password' => 'password',
        ])->assertOk()->json('expires_at');

        $this->assertSame(
            now()->addMinutes(120)->startOfMinute()->toIso8601String(),
            \Illuminate\Support\Carbon::parse($expiresAt)->startOfMinute()->toIso8601String(),
        );
    }

    public function test_guest_tokens_do_not_expire(): void
    {
        $guest = \App\Models\Guest::create(['name' => 'Joao', 'phone' => '11999998888']);

        $token = $guest->createToken('guest')->plainTextToken;

        $this->travel(30)->days();

        $this->getJson('/api/guest/me', ['Authorization' => "Bearer {$token}"])
            ->assertOk();
    }
}
