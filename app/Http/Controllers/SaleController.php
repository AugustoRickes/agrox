<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Models\Sale;
use App\Models\Payment;
use App\Models\Product;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SaleController extends Controller
{
    public function store(StoreSaleRequest $request)
    {
        // Buscar o produto
        $product = Product::findOrFail($request->product_id);
        $unitPrice = $product->price;
        $totalAmount = $unitPrice * $request->quantity;

        // Valida e calcula o troco (apenas para pagamento em dinheiro)
        $change = 0;
        $receivedAmount = null;

        if ($request->payment_type === 'cash') {
            $receivedAmount = $request->received_amount_cash;

            if ($receivedAmount < $totalAmount) {
                return back()->withErrors([
                    'received_amount_cash' => 'Valor recebido é menor que o total da venda'
                ]);
            }

            $change = $receivedAmount - $totalAmount;
        }

        // Transação para criar venda, item e pagamento
        $result = DB::transaction(function () use ($request, $product, $totalAmount, $receivedAmount, $change) {
            // Cria a venda usando o ID do usuário autenticado
            $sale = Sale::create([
                'user_id' => auth()->id(),
                'sale_date' => now(),
                'total_amount' => $totalAmount,
                'is_synced' => false,
            ]);

            // Cria o item da venda
            SaleItem::create([
                'sale_id' => $sale->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'unit_price' => $product->price,
            ]);

            // Cria o pagamento com lógica de troco
            Payment::create([
                'sale_id' => $sale->id,
                'type' => $request->payment_type,
                'amount' => $totalAmount,
                'received_amount_cash' => $receivedAmount,
                'change_cash' => $change,
                'is_synced' => false,
            ]);

            return [
                'sale' => $sale,
                'change' => $change,
                'total_amount' => $totalAmount
            ];
        });

        // Retorna com sucesso usando Inertia
        return back()->with([
            'success' => true,
            'message' => 'Venda realizada com sucesso!',
            'sale_data' => [
                'sale_id' => $result['sale']->id,
                'total_amount' => $result['total_amount'],
                'change' => $result['change']
            ]
        ]);
    }

    public function index()
    {
        $sales = Sale::with(['saleItems.product', 'payments'])
                    ->where('user_id', auth()->id())
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);

        return response()->json($sales);
    }
}
