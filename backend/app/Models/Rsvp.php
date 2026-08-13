<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rsvp extends Model
{
    protected $fillable = [
        'guest_id',
        'attending',
        'companions_count',
        'message',
    ];

    protected function casts(): array
    {
        return [
            'attending' => 'boolean',
            'companions_count' => 'integer',
        ];
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
