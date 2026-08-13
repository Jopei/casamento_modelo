<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $guestId = $request->user('guest')?->id;

        return [
            'id' => $this->id,
            'url' => Storage::url($this->path),
            'caption' => $this->caption,
            'order' => $this->order,
            'likes_count' => $this->likes()->count(),
            'liked_by_me' => $guestId
                ? $this->likes()->where('guest_id', $guestId)->exists()
                : false,
            'comments' => PhotoCommentResource::collection($this->whenLoaded('comments')),
        ];
    }
}
