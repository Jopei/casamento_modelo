<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Gift;
use App\Models\GiftReservation;
use App\Models\Guest;
use App\Models\WeddingSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class GiftReservationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('gift-reserve-min:127.0.0.1');
        RateLimiter::clear('gift-reserve-hour:127.0.0.1');
    }

    private function gift(array $attributes = []): Gift
    {
        return Gift::create($attributes + [
            'name' => 'Jogo de Panelas',
            'price' => 250.00,
            'quantity' => 1,
        ]);
    }

    private function freeGift(): Gift
    {
        return $this->gift(['is_free_amount' => true, 'price' => null, 'quantity' => 1]);
    }

    private function reserve(Gift $gift, array $body = [])
    {
        return $this->postJson("/api/gifts/{$gift->id}/reserve", $body);
    }

    private function legacy(Gift $gift, bool $showName = true): GiftReservation
    {
        $guest = Guest::create(['name' => 'Tia Legada', 'phone' => '11977776666']);

        return GiftReservation::create([
            'gift_id' => $gift->id,
            'guest_id' => $guest->id,
            'amount' => 250,
            'status' => 'pending',
            'reserved_at' => now(),
            'show_name' => $showName,
        ]);
    }

    private function admin(): Admin
    {
        return Admin::create(['name' => 'Admin', 'email' => 'admin@casamento.com', 'password' => 'password']);
    }

    public function test_anonymous_reservation_without_name(): void
    {
        $gift = $this->gift();

        $this->reserve($gift)
            ->assertOk()
            ->assertJsonPath('gift.is_available', false)
            ->assertJsonPath('reservation.status', 'reserved')
            ->assertJsonPath('reservation.amount', '250.00')
            ->assertJsonPath('reservation.pix_payload', null)
            ->assertJsonPath('reservation.giver_name', null)
            ->assertJsonPath('reservation.show_name', false)
            ->assertJsonStructure(['reservation' => ['id', 'cancel_token']]);

        $this->assertDatabaseHas('gift_reservations', [
            'gift_id' => $gift->id,
            'guest_id' => null,
            'status' => 'reserved',
        ]);
    }

    public function test_bearer_of_a_guest_is_ignored(): void
    {
        $gift = $this->gift();
        $guest = Guest::create(['name' => 'Joao', 'phone' => '11999998888']);

        $this->actingAs($guest, 'guest');
        $this->reserve($gift)->assertOk();

        $this->assertDatabaseHas('gift_reservations', ['gift_id' => $gift->id, 'guest_id' => null]);
    }

    public function test_last_unit_second_request_conflicts(): void
    {
        $gift = $this->gift();

        $this->reserve($gift)->assertOk();
        $this->reserve($gift)
            ->assertStatus(409)
            ->assertJsonPath('message', 'Este presente ja foi reservado.');

        $this->assertDatabaseCount('gift_reservations', 1);
    }

    public function test_two_units_accept_two_anonymous_and_reject_third(): void
    {
        $gift = $this->gift(['quantity' => 2]);

        $this->reserve($gift)->assertOk()->assertJsonPath('gift.available_count', 1);
        $this->reserve($gift)->assertOk()->assertJsonPath('gift.available_count', 0);
        $this->reserve($gift)->assertStatus(409);

        $this->assertDatabaseCount('gift_reservations', 2);
    }

    public function test_blank_name_becomes_null(): void
    {
        $gift = $this->gift();

        $this->reserve($gift, ['giver_name' => '   '])
            ->assertOk()
            ->assertJsonPath('reservation.giver_name', null);

        $this->assertDatabaseHas('gift_reservations', ['giver_name' => null]);
    }

    public function test_name_is_trimmed_and_limited(): void
    {
        $gift = $this->gift(['quantity' => 2]);

        $this->reserve($gift, ['giver_name' => '  Maria  '])
            ->assertOk()
            ->assertJsonPath('reservation.giver_name', 'Maria');

        $this->reserve($gift, ['giver_name' => str_repeat('a', 81)])
            ->assertStatus(422)
            ->assertJsonValidationErrors('giver_name');
    }

    public function test_show_name_without_name_is_coerced_to_false(): void
    {
        $gift = $this->gift();

        $this->reserve($gift, ['show_name' => true])
            ->assertOk()
            ->assertJsonPath('reservation.show_name', false)
            ->assertJsonPath('gift.given_by', []);

        $this->assertDatabaseHas('gift_reservations', ['show_name' => false]);
    }

    public function test_name_hidden_unless_show_name_is_true(): void
    {
        $gift = $this->gift(['quantity' => 2]);

        $this->reserve($gift, ['giver_name' => 'Joao Secreto', 'show_name' => false])->assertOk();

        $response = $this->getJson('/api/gifts')->assertOk();
        $this->assertSame([], $response->json('data.0.given_by'));
        $this->assertStringNotContainsString('Joao Secreto', $response->getContent());

        $this->reserve($gift, ['giver_name' => 'Maria Feliz', 'show_name' => true])
            ->assertOk()
            ->assertJsonPath('gift.given_by', ['Maria Feliz']);

        $response = $this->getJson('/api/gifts')->assertOk();
        $this->assertSame(['Maria Feliz'], $response->json('data.0.given_by'));
        $this->assertStringNotContainsString('Joao Secreto', $response->getContent());
    }

    public function test_legacy_reservation_stays_in_given_by_and_admin_lists_all(): void
    {
        $gift = $this->gift(['quantity' => 2]);
        $this->legacy($gift);
        $this->reserve($gift, ['giver_name' => 'Anon'])->assertOk();

        $this->assertSame(['Tia Legada'], $this->getJson('/api/gifts')->json('data.0.given_by'));

        $admin = $this->admin();
        $items = $this->actingAs($admin, 'admin')
            ->getJson('/api/admin/gift-reservations')
            ->assertOk()
            ->json('data');

        $byName = collect($items)->keyBy('giver_name');
        $this->assertSame('11977776666', $byName['Tia Legada']['phone']);
        $this->assertNull($byName['Anon']['phone']);
        $this->assertArrayNotHasKey('guest', $items[0]);

        $this->actingAs($admin, 'admin')
            ->getJson('/api/admin/gifts')
            ->assertOk();
    }

    public function test_public_list_never_exposes_phone_or_cancel_secrets(): void
    {
        $gift = $this->gift(['quantity' => 2]);
        $this->legacy($gift);
        $token = $this->reserve($gift, ['giver_name' => 'Ana', 'show_name' => true])
            ->json('reservation.cancel_token');

        $content = $this->getJson('/api/gifts')->assertOk()->getContent();

        $this->assertStringNotContainsString('11977776666', $content);
        $this->assertStringNotContainsString($token, $content);
        $this->assertStringNotContainsString(hash('sha256', $token), $content);
        $this->assertStringNotContainsString('cancel_token', $content);
        $this->assertStringNotContainsString('phone', $content);
    }

    public function test_cancel_with_right_token_frees_the_unit(): void
    {
        $gift = $this->gift();
        $data = $this->reserve($gift)->json('reservation');

        $this->assertSame(40, strlen($data['cancel_token']));
        $this->assertDatabaseMissing('gift_reservations', ['cancel_token_hash' => $data['cancel_token']]);

        $this->postJson("/api/gift-reservations/{$data['id']}/cancel", ['cancel_token' => $data['cancel_token']])
            ->assertNoContent();

        $this->assertDatabaseCount('gift_reservations', 0);
        $this->assertTrue($gift->fresh()->is_available);
    }

    public function test_cancel_with_wrong_or_missing_token_is_forbidden(): void
    {
        $gift = $this->gift();
        $id = $this->reserve($gift)->json('reservation.id');

        $this->postJson("/api/gift-reservations/{$id}/cancel", ['cancel_token' => 'errado'])->assertForbidden();
        $this->postJson("/api/gift-reservations/{$id}/cancel")->assertForbidden();

        $this->assertDatabaseCount('gift_reservations', 1);
    }

    public function test_cancel_legacy_reservation_without_hash_is_forbidden(): void
    {
        $legacy = $this->legacy($this->gift());

        $this->postJson("/api/gift-reservations/{$legacy->id}/cancel", ['cancel_token' => 'qualquer'])
            ->assertForbidden();
        $this->postJson("/api/gift-reservations/{$legacy->id}/cancel", ['cancel_token' => ''])
            ->assertForbidden();

        $this->assertDatabaseCount('gift_reservations', 1);
    }

    public function test_cancel_paid_reservation_conflicts(): void
    {
        $gift = $this->gift();
        $data = $this->reserve($gift)->json('reservation');
        GiftReservation::first()->update(['status' => GiftReservation::STATUS_PAID, 'paid_at' => now()]);

        $this->postJson("/api/gift-reservations/{$data['id']}/cancel", ['cancel_token' => $data['cancel_token']])
            ->assertStatus(409);

        $this->assertDatabaseCount('gift_reservations', 1);
    }

    public function test_cancel_unknown_reservation_is_404(): void
    {
        $this->postJson('/api/gift-reservations/999/cancel', ['cancel_token' => 'x'])->assertNotFound();
    }

    public function test_old_delete_route_is_gone(): void
    {
        $gift = $this->gift();

        $this->deleteJson("/api/gifts/{$gift->id}/reserve")->assertStatus(405);
    }

    public function test_free_amount_requires_amount_and_min_value(): void
    {
        $gift = $this->freeGift();

        $this->reserve($gift)->assertStatus(422)->assertJsonValidationErrors('amount');
        $this->reserve($gift, ['amount' => 0.5])->assertStatus(422)->assertJsonValidationErrors('amount');
    }

    public function test_free_amount_contributions_are_separate_pending_rows_with_pix(): void
    {
        WeddingSetting::current()->update([
            'bride_name' => 'Maria',
            'groom_name' => 'Joaquim',
            'wedding_date' => now()->addMonth(),
            'pix_key' => '11999998888',
            'pix_merchant_name' => 'Joaquim e Maria',
            'pix_city' => 'Sao Paulo',
        ]);
        $gift = $this->freeGift();

        $first = $this->reserve($gift, ['amount' => 50])
            ->assertOk()
            ->assertJsonPath('reservation.status', 'pending')
            ->assertJsonPath('reservation.amount', '50.00')
            ->assertJsonPath('gift.is_available', true)
            ->json('reservation');
        $second = $this->reserve($gift, ['amount' => 30])
            ->assertOk()
            ->assertJsonPath('reservation.amount', '30.00')
            ->json('reservation');

        $this->assertDatabaseCount('gift_reservations', 2);
        $this->assertDatabaseHas('gift_reservations', ['status' => 'pending', 'amount' => 50, 'guest_id' => null]);
        $this->assertStringContainsString('540550.00', $first['pix_payload']);
        $this->assertStringContainsString('540530.00', $second['pix_payload']);
        $this->assertStringContainsString('BR.GOV.BCB.PIX', $first['pix_payload']);
        $this->assertNotSame($first['pix_payload'], $second['pix_payload']);
    }

    public function test_priced_gift_never_returns_pix_even_with_key_configured(): void
    {
        WeddingSetting::current()->update(['pix_key' => '11999998888']);

        $this->reserve($this->gift())->assertOk()->assertJsonPath('reservation.pix_payload', null);
    }

    public function test_show_name_must_be_boolean(): void
    {
        $this->reserve($this->gift(), ['show_name' => 'talvez'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('show_name');
    }

    public function test_admin_cannot_mark_a_reserved_reservation(): void
    {
        $this->reserve($this->gift());
        $reservation = GiftReservation::first();
        $admin = $this->admin();

        $this->actingAs($admin, 'admin')
            ->patchJson("/api/admin/gift-reservations/{$reservation->id}", ['status' => 'paid'])
            ->assertStatus(422);

        $this->assertSame('reserved', $reservation->fresh()->status);

        $reservation->update(['status' => 'pending']);
        $this->actingAs($admin, 'admin')
            ->patchJson("/api/admin/gift-reservations/{$reservation->id}", ['status' => 'paid'])
            ->assertOk()
            ->assertJsonPath('data.status', 'paid');
    }

    public function test_throttle_returns_429(): void
    {
        $gift = $this->freeGift();

        for ($i = 0; $i < 6; $i++) {
            $this->reserve($gift, ['amount' => 5])->assertOk();
        }

        $this->reserve($gift, ['amount' => 5])->assertStatus(429);
    }

    public function test_public_settings_never_expose_the_pix_key(): void
    {
        WeddingSetting::current()->update([
            'bride_name' => 'Maria',
            'groom_name' => 'Joaquim',
            'wedding_date' => now()->addMonth(),
            'pix_key' => '11999998888',
        ]);

        $response = $this->getJson('/api/settings')->assertOk();

        $this->assertArrayNotHasKey('pix_key', $response->json('data'));
    }
}
