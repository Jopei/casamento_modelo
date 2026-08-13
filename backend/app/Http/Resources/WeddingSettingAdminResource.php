<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * Mesmos campos do site publico mais os dados do PIX, que nunca sao
 * expostos em /api/settings.
 */
class WeddingSettingAdminResource extends WeddingSettingResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request) + [
            'pix_key' => $this->pix_key,
            'pix_key_type' => $this->pix_key_type,
            'pix_merchant_name' => $this->pix_merchant_name,
            'pix_city' => $this->pix_city,
        ];
    }
}
