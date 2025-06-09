<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'payment_type' => 'required|in:pix,cash',
            'received_amount_cash' => 'nullable|required_if:payment_type,cash|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Selecione um produto.',
            'product_id.exists' => 'Produto não encontrado.',
            'quantity.required' => 'Informe a quantidade.',
            'quantity.min' => 'Quantidade deve ser maior que zero.',
            'payment_type.required' => 'Selecione a forma de pagamento.',
            'payment_type.in' => 'Forma de pagamento inválida.',
            'received_amount_cash.required_if' => 'Informe o valor recebido para pagamento em dinheiro.',
            'received_amount_cash.min' => 'Valor recebido deve ser maior que zero.',
        ];
    }
}
