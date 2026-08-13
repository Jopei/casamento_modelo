<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:10240'],
            'is_free_amount' => ['nullable', 'boolean'],
            'price' => [
                Rule::requiredIf(fn () => ! $this->boolean('is_free_amount')),
                'nullable',
                'numeric',
                'min:0',
                'max:999999.99',
            ],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:999'],
        ];
    }

    public function messages(): array
    {
        return [
            'price.required' => 'Informe o valor do presente ou marque a opcao de valor livre.',
        ];
    }
}
