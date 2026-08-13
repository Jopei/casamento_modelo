<?php

namespace Tests\Feature;

use App\Models\Gift;
use App\Models\GiftReservation;
use App\Models\Guest;
use App\Models\WeddingSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GiftReservationTest extends TestCase
{
    use RefreshDatabase;

    private function gift(array $attributes = []): Gift
    {
        return Gift::create($attributes + [
            'name' => 'Jogo de Panelas',
            'price' => 250.00,
            'quantity' => 1,
        ]);
    }

    private function guest(string $name = 'Joao', string $phone = '11999998888'): Guest
    {
        return Guest::create(['name' => $name, 'phone' => $phone]);
    }

    public function test_guest_can_reserve_an_available_gift(): void
    {
        $gift = $this->gift();
        $guest = $this->guest();

        $this->actingAs($guest, 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertOk()
            ->assertJsonPath('gift.is_available', false)
            ->assertJsonPath('gift.reserved_count', 1)
            ->assertJsonPath('reservation.amount', '250.00')
            ->assertJsonPath('reservation.status', 'pending');

        $this->assertDatabaseHas('gift_reservations', [
            'gift_id' => $gift->id,
            'guest_id' => $guest->id,
            'amount' => 250.00,
            'status' => 'pending',
        ]);
    }

    public function test_second_guest_cannot_reserve_an_already_reserved_gift(): void
    {
        $gift = $this->gift();
        $firstGuest = $this->guest();
        $secondGuest = $this->guest('Maria', '11999997777');

        $this->actingAs($firstGuest, 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertOk();

        $this->actingAs($secondGuest, 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertStatus(409);

        $this->assertDatabaseCount('gift_reservations', 1);
    }

    public function test_a_gift_with_two_units_accepts_two_different_guests(): void
    {
        $gift = $this->gift(['quantity' => 2]);

        $this->actingAs($this->guest('Joao', '11999998888'), 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertOk()
            ->assertJsonPath('gift.is_available', true)
            ->assertJsonPath('gift.available_count', 1);

        $this->actingAs($this->guest('Maria', '11999997777'), 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertOk()
            ->assertJsonPath('gift.is_available', false)
            ->assertJsonPath('gift.available_count', 0);

        $this->actingAs($this->guest('Ana', '11999996666'), 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertStatus(409);

        $this->assertDatabaseCount('gift_reservations', 2);
    }

    public function test_the_same_guest_cannot_take_two_units_of_the_same_gift(): void
    {
        $gift = $this->gift(['quantity' => 3]);
        $guest = $this->guest();

        $this->actingAs($guest, 'guest')->postJson("/api/gifts/{$gift->id}/reserve")->assertOk();

        $this->actingAs($guest, 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertStatus(409);

        $this->assertDatabaseCount('gift_reservations', 1);
    }

    public function test_the_same_guest_can_reserve_two_different_gifts(): void
    {
        $first = $this->gift(['name' => 'Jogo de Panelas']);
        $second = $this->gift(['name' => 'Jogo de Cama']);
        $guest = $this->guest();

        $this->actingAs($guest, 'guest')->postJson("/api/gifts/{$first->id}/reserve")->assertOk();
        $this->actingAs($guest, 'guest')->postJson("/api/gifts/{$second->id}/reserve")->assertOk();

        $this->assertDatabaseCount('gift_reservations', 2);
    }

    public function test_a_free_amount_gift_requires_an_amount(): void
    {
        $gift = $this->gift(['is_free_amount' => true, 'price' => null]);

        $this->actingAs($this->guest(), 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertStatus(422)
            ->assertJsonValidationErrors('amount');
    }

    public function test_a_free_amount_gift_never_runs_out_and_sums_repeat_contributions(): void
    {
        $gift = $this->gift(['is_free_amount' => true, 'price' => null]);
        $guest = $this->guest();

        $this->actingAs($guest, 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve", ['amount' => 50])
            ->assertOk()
            ->assertJsonPath('reservation.amount', '50.00')
            ->assertJsonPath('gift.is_available', true);

        $this->actingAs($guest, 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve", ['amount' => 30])
            ->assertOk()
            ->assertJsonPath('reservation.amount', '80.00');

        $this->actingAs($this->guest('Maria', '11999997777'), 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve", ['amount' => 20])
            ->assertOk();

        $this->assertDatabaseCount('gift_reservations', 2);
    }

    public function test_a_free_amount_gift_rejects_a_value_below_one_real(): void
    {
        $gift = $this->gift(['is_free_amount' => true, 'price' => null]);

        $this->actingAs($this->guest(), 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve", ['amount' => 0.5])
            ->assertStatus(422)
            ->assertJsonValidationErrors('amount');
    }

    public function test_the_reservation_returns_a_pix_payload_with_the_gift_amount(): void
    {
        WeddingSetting::current()->update([
            'bride_name' => 'Maria',
            'groom_name' => 'Joaquim',
            'wedding_date' => now()->addMonth(),
            'pix_key' => '11999998888',
            'pix_merchant_name' => 'Joaquim e Maria',
            'pix_city' => 'Sao Paulo',
        ]);

        $gift = $this->gift(['price' => 25.00]);

        $payload = $this->actingAs($this->guest(), 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertOk()
            ->json('reservation.pix_payload');

        $this->assertStringContainsString('BR.GOV.BCB.PIX', $payload);
        $this->assertStringContainsString('540525.00', $payload);
        $this->assertStringContainsString('JOAQUIM E MARIA', $payload);
    }

    public function test_the_pix_payload_is_null_when_the_couple_has_no_key_configured(): void
    {
        $gift = $this->gift();

        $this->actingAs($this->guest(), 'guest')
            ->postJson("/api/gifts/{$gift->id}/reserve")
            ->assertOk()
            ->assertJsonPath('reservation.pix_payload', null);
    }

    public function test_guest_can_release_a_pending_reservation(): void
    {
        $gift = $this->gift();
        $guest = $this->guest();

        $this->actingAs($guest, 'guest')->postJson("/api/gifts/{$gift->id}/reserve")->assertOk();

        $this->actingAs($guest, 'guest')
            ->deleteJson("/api/gifts/{$gift->id}/reserve")
            ->assertNoContent();

        $this->assertDatabaseCount('gift_reservations', 0);
        $this->assertTrue($gift->fresh()->is_available);
    }

    public function test_guest_cannot_release_a_reservation_already_confirmed_by_the_couple(): void
    {
        $gift = $this->gift();
        $guest = $this->guest();

        $this->actingAs($guest, 'guest')->postJson("/api/gifts/{$gift->id}/reserve")->assertOk();
        GiftReservation::first()->update(['status' => GiftReservation::STATUS_PAID, 'paid_at' => now()]);

        $this->actingAs($guest, 'guest')
            ->deleteJson("/api/gifts/{$gift->id}/reserve")
            ->assertStatus(409);

        $this->assertDatabaseCount('gift_reservations', 1);
    }

    public function test_guest_cannot_release_someone_elses_reservation(): void
    {
        $gift = $this->gift();

        $this->actingAs($this->guest(), 'guest')->postJson("/api/gifts/{$gift->id}/reserve")->assertOk();

        $this->actingAs($this->guest('Maria', '11999997777'), 'guest')
            ->deleteJson("/api/gifts/{$gift->id}/reserve")
            ->assertStatus(403);

        $this->assertDatabaseCount('gift_reservations', 1);
    }

    public function test_public_gift_list_hides_reservation_identity(): void
    {
        $gift = $this->gift();

        $this->actingAs($this->guest(), 'guest')->postJson("/api/gifts/{$gift->id}/reserve");

        $response = $this->getJson('/api/gifts');

        $response->assertOk();
        $this->assertArrayNotHasKey('guest_id', $response->json('data.0'));
        $this->assertArrayNotHasKey('reserved_by', $response->json('data.0'));
        $this->assertArrayNotHasKey('reservations', $response->json('data.0'));
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
