<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PhotoAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => Storage::url($this->path),
            'caption' => $this->caption,
            'order' => $this->order,
            'likes_count' => $this->likes()->count(),
            'comments_count' => $this->comments()->count(),
            'created_at' => $this->created_at,
        ];
    }
}
