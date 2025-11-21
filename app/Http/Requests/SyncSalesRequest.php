<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncSalesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sales' => 'required|array',
            'sales.*.id' => 'required|string',
            'sales.*.product_id' => 'required|integer|exists:products,id',
            'sales.*.quantity' => 'required|integer|min:1',
            'sales.*.payment_type' => 'required|in:pix,cash',
            'sales.*.received_amount_cash' => 'nullable|numeric',
            'sales.*.total_amount' => 'required|numeric',
            'sales.*.change_cash' => 'required|numeric',
            'sales.*.created_at' => 'required|date'
        ];
    }
}
