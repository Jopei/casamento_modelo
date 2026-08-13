<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhotoLike extends Model
{
    protected $fillable = [
        'photo_id',
        'guest_id',
    ];

    public function photo()
    {
        return $this->belongsTo(Photo::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
