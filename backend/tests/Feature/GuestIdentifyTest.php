<?php

namespace Tests\Feature;

use App\Models\Guest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestIdentifyTest extends TestCase
{
    use RefreshDatabase;

    public function test_first_identify_creates_guest_and_returns_token(): void
    {
        $response = $this->postJson('/api/guest/identify', [
            'name' => 'Maria Teste',
            'phone' => '(11) 98888-7777',
        ]);

        $response->assertOk()
            ->assertJsonPath('guest.name', 'Maria Teste')
            ->assertJsonPath('guest.phone', '11988887777');

        $this->assertDatabaseCount('guests', 1);
        $this->assertNotEmpty($response->json('token'));
    }

    public function test_second_identify_with_same_phone_reuses_guest(): void
    {
        $guest = Guest::create(['name' => 'Maria', 'phone' => '11988887777']);

        $response = $this->postJson('/api/guest/identify', [
            'name' => 'Maria Atualizada',
            'phone' => '11988887777',
        ]);

        $response->assertOk()->assertJsonPath('guest.id', $guest->id);
        $this->assertDatabaseCount('guests', 1);
        $this->assertSame('Maria Atualizada', $guest->fresh()->name);
    }
}
