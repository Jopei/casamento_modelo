<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWeddingSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bride_name' => ['required', 'string', 'max:255'],
            'groom_name' => ['required', 'string', 'max:255'],
            'wedding_date' => ['required', 'date'],
            'hero_image' => ['nullable', 'image', 'max:10240'],
            'welcome_message' => ['nullable', 'string'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'location_address' => ['nullable', 'string', 'max:255'],
            'location_map_embed_url' => ['nullable', 'string', 'max:2000'],
            'location_directions_url' => ['nullable', 'string', 'max:2000'],
            'dress_code_text' => ['nullable', 'string'],
            'dress_code_colors' => ['nullable', 'array'],
            'dress_code_colors.*' => ['string', 'max:20'],
            'pix_key' => ['nullable', 'string', 'max:255'],
            'pix_key_type' => ['nullable', 'string', 'max:20'],
            // Limites exigidos pelo padrao BR Code do Banco Central.
            'pix_merchant_name' => ['nullable', 'string', 'max:25'],
            'pix_city' => ['nullable', 'string', 'max:15'],
        ];
    }
}
