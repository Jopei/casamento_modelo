<?php

namespace App\Http\Requests\Guest;

use Illuminate\Foundation\Http\FormRequest;

class StoreRsvpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attending' => ['required', 'boolean'],
            'companions_count' => ['required', 'integer', 'min:0', 'max:20'],
            'message' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
