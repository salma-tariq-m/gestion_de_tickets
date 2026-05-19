<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status_id' => 'sometimes|exists:statuses,id',
            'priority_id' => 'sometimes|exists:priorities,id',
            'category_id' => 'sometimes|exists:categories,id',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
        ];
    }
}
