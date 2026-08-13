<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoryItem extends Model
{
    protected $fillable = [
        'title',
        'description',
        'year',
        'image_path',
        'order',
    ];
}
