<?php

namespace App\Http\Controllers\Api\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\StoreCommentRequest;
use App\Http\Resources\PhotoCommentResource;
use App\Models\Photo;
use App\Models\PhotoComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class PhotoInteractionController extends Controller
{
    public function like(Request $request, Photo $photo)
    {
        $guest = $request->user('guest');

        $photo->likes()->firstOrCreate(['guest_id' => $guest->id]);

        return response()->json(['likes_count' => $photo->likes()->count()]);
    }

    public function unlike(Request $request, Photo $photo)
    {
        $guest = $request->user('guest');

        $photo->likes()->where('guest_id', $guest->id)->delete();

        return response()->json(['likes_count' => $photo->likes()->count()]);
    }

    public function storeComment(StoreCommentRequest $request, Photo $photo)
    {
        $guest = $request->user('guest');

        $comment = $photo->comments()->create([
            'guest_id' => $guest->id,
            'body' => $request->validated('body'),
        ]);

        return new PhotoCommentResource($comment->load('guest'));
    }

    public function destroyComment(Request $request, Photo $photo, PhotoComment $comment)
    {
        $guest = $request->user('guest');

        if ($comment->photo_id !== $photo->id || $comment->guest_id !== $guest->id) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $comment->delete();

        return response()->noContent();
    }

    public function download(Photo $photo)
    {
        return Storage::disk('public')->download($photo->path);
    }
}
