<?php

namespace App\Http\Requests\Guest;

use Illuminate\Foundation\Http\FormRequest;

class StoreGiftReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'giver_name' => ['nullable', 'string', 'max:80'],
            'show_name' => ['sometimes', 'boolean'],
        ];
    }
}
