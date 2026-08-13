<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_type' => $this->event_type,
            'time' => $this->time,
            'title' => $this->title,
            'description' => $this->description,
            'icon' => $this->icon,
            'order' => $this->order,
        ];
    }
}
