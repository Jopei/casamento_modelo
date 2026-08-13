<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gift extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'quantity',
        'is_free_amount',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'quantity' => 'integer',
            'is_free_amount' => 'boolean',
        ];
    }

    public function reservations()
    {
        return $this->hasMany(GiftReservation::class);
    }

    /**
     * Usa reservations_count quando a relacao ja foi contada na query,
     * evitando um SELECT por presente na listagem.
     */
    public function getReservedCountAttribute(): int
    {
        return $this->reservations_count ?? $this->reservations()->count();
    }

    public function getAvailableCountAttribute(): int
    {
        return max(0, $this->quantity - $this->reserved_count);
    }

    public function getIsAvailableAttribute(): bool
    {
        return $this->is_free_amount || $this->available_count > 0;
    }
}
