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
        try {
            DB::beginTransaction();

            // Busca o produto
            $product = Product::findOrFail($request->product_id);
            $unitPrice = $product->price;
            $totalAmount = $unitPrice * $request->quantity;

            // Valida e calcula o troco (apenas para pagamento em dinheiro)
            $change = 0;
            $receivedAmount = null;

            if ($request->payment_type === 'cash') {
                $receivedAmount = $request->received_amount_cash;

                if ($receivedAmount < $totalAmount) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Valor recebido é menor que o total da venda',
                        'errors' => ['received_amount_cash' => ['Valor insuficiente']]
                    ], 422);
                }

                $change = $receivedAmount - $totalAmount;
            }

            // Cria a venda
            $sale = Sale::create([
                'user_id' => auth()->id() ?? 1, // Fallback para desenvolvimento
                'sale_date' => now(),
                'total_amount' => $totalAmount,
                'is_synced' => false,
            ]);

            // Cria o item da venda
            SaleItem::create([
                'sale_id' => $sale->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'unit_price' => $unitPrice,
            ]);

            // Cria o pagamento
            Payment::create([
                'sale_id' => $sale->id,
                'type' => $request->payment_type,
                'amount' => $totalAmount,
                'received_amount_cash' => $receivedAmount,
                'change_cash' => $change,
                'is_synced' => false,
            ]);

            DB::commit();

            // Log da transação
            Log::info('Venda realizada', [
                'sale_id' => $sale->id,
                'total_amount' => $totalAmount,
                'payment_type' => $request->payment_type,
                'change' => $change
            ]);

            return response()->json([
                'success' => true,
                'sale_id' => $sale->id,
                'total_amount' => $totalAmount,
                'change' => $change,
                'message' => 'Venda realizada com sucesso!'
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Erro ao processar venda', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro interno do servidor'
            ], 500);
        }
    }

    public function index()
    {
        $sales = Sale::with(['saleItems.product', 'payments'])
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);

        return response()->json($sales);
    }
}
