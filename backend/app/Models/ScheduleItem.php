<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleItem extends Model
{
    protected $fillable = [
        'event_type',
        'time',
        'title',
        'description',
        'icon',
        'order',
    ];
}
