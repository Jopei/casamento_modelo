<?php

namespace Tests\Feature;

use App\Models\Guest;
use App\Models\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhotoLikeCommentTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_like_and_unlike_a_photo(): void
    {
        $photo = Photo::create(['path' => 'photos/test.jpg']);
        $guest = Guest::create(['name' => 'Joao', 'phone' => '11999998888']);

        $this->actingAs($guest, 'guest')
            ->postJson("/api/photos/{$photo->id}/like")
            ->assertOk()
            ->assertJsonPath('likes_count', 1);

        $this->actingAs($guest, 'guest')
            ->deleteJson("/api/photos/{$photo->id}/like")
            ->assertOk()
            ->assertJsonPath('likes_count', 0);
    }

    public function test_guest_can_comment_but_only_delete_own_comment(): void
    {
        $photo = Photo::create(['path' => 'photos/test.jpg']);
        $author = Guest::create(['name' => 'Joao', 'phone' => '11999998888']);
        $otherGuest = Guest::create(['name' => 'Maria', 'phone' => '11999997777']);

        $commentResponse = $this->actingAs($author, 'guest')
            ->postJson("/api/photos/{$photo->id}/comments", ['body' => 'Que foto linda!'])
            ->assertCreated();

        $commentId = $commentResponse->json('data.id');

        $this->actingAs($otherGuest, 'guest')
            ->deleteJson("/api/photos/{$photo->id}/comments/{$commentId}")
            ->assertForbidden();

        $this->actingAs($author, 'guest')
            ->deleteJson("/api/photos/{$photo->id}/comments/{$commentId}")
            ->assertNoContent();

        $this->assertDatabaseCount('photo_comments', 0);
    }
}
