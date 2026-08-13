<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GiftReservation extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_PAID = 'paid';

    protected $fillable = [
        'gift_id',
        'guest_id',
        'amount',
        'status',
        'reserved_at',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'reserved_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function gift()
    {
        return $this->belongsTo(Gift::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function isPaid(): bool
    {
        return $this->status === self::STATUS_PAID;
    }
}
