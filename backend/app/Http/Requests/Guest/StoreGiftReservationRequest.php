<?php

namespace App\Http\Requests\Guest;

use App\Models\Gift;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGiftReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $gift = $this->route('gift');

        return [
            'amount' => [
                Rule::requiredIf(fn () => $gift instanceof Gift && $gift->is_free_amount),
                'nullable',
                'numeric',
                'min:1',
                'max:999999.99',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Informe o valor que deseja presentear.',
            'amount.min' => 'O valor minimo e de R$ 1,00.',
        ];
    }
}
