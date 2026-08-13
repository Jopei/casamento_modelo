<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RsvpResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'guest' => [
                'name' => $this->guest->name,
                'phone' => $this->guest->phone,
            ],
            'attending' => $this->attending,
            'companions_count' => $this->companions_count,
            'message' => $this->message,
            'created_at' => $this->created_at,
        ];
    }
}
