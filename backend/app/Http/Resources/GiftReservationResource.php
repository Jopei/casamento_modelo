<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GiftReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gift' => [
                'id' => $this->gift->id,
                'name' => $this->gift->name,
                'is_free_amount' => $this->gift->is_free_amount,
            ],
            'guest' => [
                'name' => $this->guest->name,
                'phone' => $this->guest->phone,
            ],
            'amount' => $this->amount,
            'status' => $this->status,
            'reserved_at' => $this->reserved_at,
            'paid_at' => $this->paid_at,
        ];
    }
}
