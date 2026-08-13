<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class GiftAdminResource extends JsonResource
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
            'reservations' => $this->whenLoaded(
                'reservations',
                fn () => $this->reservations->map(fn ($reservation) => [
                    'id' => $reservation->id,
                    'guest_name' => $reservation->guest->name,
                    'guest_phone' => $reservation->guest->phone,
                    'amount' => $reservation->amount,
                    'status' => $reservation->status,
                    'reserved_at' => $reservation->reserved_at,
                    'paid_at' => $reservation->paid_at,
                ])->all(),
            ),
        ];
    }
}
