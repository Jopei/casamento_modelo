<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'year' => ['nullable', 'string', 'max:10'],
            'image' => ['nullable', 'image', 'max:10240'],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
