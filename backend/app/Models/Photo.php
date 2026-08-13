<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = [
        'path',
        'caption',
        'uploaded_by_admin_id',
        'order',
    ];

    public function likes()
    {
        return $this->hasMany(PhotoLike::class);
    }

    public function comments()
    {
        return $this->hasMany(PhotoComment::class);
    }

    public function uploadedByAdmin()
    {
        return $this->belongsTo(Admin::class, 'uploaded_by_admin_id');
    }
}
