<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeddingSetting extends Model
{
    protected $fillable = [
        'bride_name',
        'groom_name',
        'wedding_date',
        'hero_image_path',
        'welcome_message',
        'location_name',
        'location_address',
        'location_map_embed_url',
        'location_directions_url',
        'dress_code_text',
        'dress_code_colors',
        'pix_key',
        'pix_key_type',
        'pix_merchant_name',
        'pix_city',
    ];

    protected function casts(): array
    {
        return [
            'wedding_date' => 'datetime',
            'dress_code_colors' => 'array',
        ];
    }

    /**
     * A linha e criada com valores neutros porque bride_name, groom_name e
     * wedding_date sao obrigatorios no banco; o casal ajusta tudo depois
     * pelo painel.
     */
    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1], [
            'bride_name' => 'Noiva',
            'groom_name' => 'Noivo',
            'wedding_date' => now()->addYear(),
        ]);
    }
}
