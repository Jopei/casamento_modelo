<?php

namespace Tests\Feature;

use App\Models\Guest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RsvpTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_guest_cannot_submit_rsvp(): void
    {
        $this->postJson('/api/rsvp', [
            'attending' => true,
            'companions_count' => 1,
        ])->assertUnauthorized();
    }

    public function test_guest_can_submit_and_update_rsvp(): void
    {
        $guest = Guest::create(['name' => 'Joao', 'phone' => '11999998888']);

        $this->actingAs($guest, 'guest')
            ->postJson('/api/rsvp', [
                'attending' => true,
                'companions_count' => 2,
                'message' => 'Mal posso esperar!',
            ])
            ->assertCreated()
            ->assertJsonPath('data.companions_count', 2);

        $this->assertDatabaseCount('rsvps', 1);

        // Submitting again updates the existing RSVP instead of creating a new one.
        $this->actingAs($guest, 'guest')
            ->postJson('/api/rsvp', [
                'attending' => true,
                'companions_count' => 3,
            ])
            ->assertOk()
            ->assertJsonPath('data.companions_count', 3);

        $this->assertDatabaseCount('rsvps', 1);
    }
}
