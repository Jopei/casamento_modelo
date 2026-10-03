<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class GiftResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'image_url' => $this->image_path ? Storage::url($this->image_path) : null,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'is_free_amount' => $this->is_free_amount,
            'reserved_count' => $this->reserved_count,
            'available_count' => $this->available_count,
            'is_available' => $this->is_available,
            // Somente quem optou por aparecer (show_name); nunca telefone.
            'given_by' => $this->relationLoaded('reservations')
                ? $this->reservations
                    ->where('show_name', true)
                    ->sortBy('reserved_at')
                    ->map(fn ($r) => $r->guest?->name)
                    ->filter()
                    ->values()
                    ->all()
                : [],
        ];
    }
}
