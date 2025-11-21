<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncSalesRequest;
use App\Models\OfflineSyncLog;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SyncController extends Controller
{
    public function syncSales(SyncSalesRequest $request): JsonResponse
    {
        $log = null;
        try {
            $sales = $request->input('sales');
            $batchId = Str::uuid()->toString();

            // Log da tentativa
            $log = OfflineSyncLog::create([
                'sync_batch_id' => $batchId,
                'attempt_number' => 1, // This could be incremented in a retry mechanism
                'status' => 'pending',
                'sales_data' => $sales,
                'attempted_at' => now()
            ]);

            $processedSales = $this->processSalesBatch($sales);

            $log->update([
                'status' => 'success',
                'sales_data' => $processedSales // Includes server IDs
            ]);

            return response()->json([
                'batch_id' => $batchId,
                'synced_sales' => $processedSales,
                'message' => 'Vendas sincronizadas com sucesso'
            ]);

        } catch (\Exception $e) {
            if ($log) {
                $log->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage()
                ]);
            }

            return response()->json([
                'error' => 'Falha na sincronização',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function syncStatus(): JsonResponse
    {
        $user = auth()->user();
        $pendingSyncs = OfflineSyncLog::where('status', 'pending')->count();

        return response()->json([
            'user_id' => $user->id,
            'pending_syncs' => $pendingSyncs,
            'last_sync' => OfflineSyncLog::latest('attempted_at')->first()?->attempted_at,
            'online' => true
        ]);
    }

    private function processSalesBatch(array $sales): array
    {
        $processed = [];

        DB::transaction(function () use ($sales, &$processed) {
            foreach ($sales as $saleData) {
                // Evita duplicatas caso a sincronização seja reenviada
                $existingSale = Sale::where('offline_id', $saleData['id'])->first();
                if ($existingSale) {
                    $processed[] = [
                        'offline_id' => $saleData['id'],
                        'server_id' => $existingSale->id,
                        'synced_at' => $existingSale->synced_at,
                        'status' => 'already_synced'
                    ];
                    continue;
                }
                
                $sale = Sale::create([
                    'user_id' => auth()->id(),
                    'total_amount' => $saleData['total_amount'],
                    'sale_date' => $saleData['created_at'],
                    'offline_id' => $saleData['id'],
                    'is_synced' => true,
                    'synced_at' => now()
                ]);

                // Assuming one item per sale for simplicity as per request.
                // If a sale can have multiple products, saleData should contain an array of items.
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $saleData['product_id'],
                    'quantity' => $saleData['quantity'],
                    'unit_price' => $saleData['total_amount'] / $saleData['quantity'], // Assuming total_amount is for this item
                    'total' => $saleData['total_amount'],
                ]);
                
                // Here you might create Payment records as well if needed

                $processed[] = [
                    'offline_id' => $saleData['id'],
                    'server_id' => $sale->id,
                    'synced_at' => $sale->synced_at->toIso8601String(),
                    'status' => 'synced'
                ];
            }
        });

        return $processed;
    }
}
