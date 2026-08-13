<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Guest extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'phone',
    ];

    public function rsvp()
    {
        return $this->hasOne(Rsvp::class);
    }

    public function giftReservations()
    {
        return $this->hasMany(GiftReservation::class);
    }

    public function photoLikes()
    {
        return $this->hasMany(PhotoLike::class);
    }

    public function photoComments()
    {
        return $this->hasMany(PhotoComment::class);
    }
}
