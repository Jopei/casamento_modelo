<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class WeddingSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'bride_name' => $this->bride_name,
            'groom_name' => $this->groom_name,
            'wedding_date' => $this->wedding_date,
            'hero_image_url' => $this->hero_image_path ? Storage::url($this->hero_image_path) : null,
            'welcome_message' => $this->welcome_message,
            'location_name' => $this->location_name,
            'location_address' => $this->location_address,
            'location_map_embed_url' => $this->location_map_embed_url,
            'location_directions_url' => $this->location_directions_url,
            'dress_code_text' => $this->dress_code_text,
            'dress_code_colors' => $this->dress_code_colors ?? [],
        ];
    }
}
