<?php

namespace Database\Seeders;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('e necessario ter usuarios e produtos cadastrados antes de executar este seeder.');
            return;
        }

        // gera vendas pra todos os dias do ano atual
        $startDate = Carbon::now()->startOfYear();
        $endDate = Carbon::now()->endOfYear();

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $salesPerDay = rand(0, 5);

            for ($i = 0; $i < $salesPerDay; $i++) {
                $sale = Sale::create([
                    'user_id' => $users->random()->id,
                    'sale_date' => $date->copy()->addHours(rand(8, 18))->addMinutes(rand(0, 59)),
                    'total_amount' => 0,
                    'is_synced' => true,
                    'created_at' => $date->copy()->addHours(rand(8, 18))->addMinutes(rand(0, 59)),
                    'updated_at' => $date->copy()->addHours(rand(8, 18))->addMinutes(rand(0, 59)),
                ]);

                $total = 0;
                $itemsPerSale = rand(1, 4);

                for ($j = 0; $j < $itemsPerSale; $j++) {
                    $product = $products->random();
                    $quantity = rand(1, 10);
                    $unitPrice = $product->price;
                    $itemTotal = $quantity * $unitPrice;

                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                    ]);

                    $total += $itemTotal;
                }

                // atualiza o total da venda
                $sale->update(['total_amount' => $total]);
            }
        }

        $this->command->info('vendas aleatorias criadas para teste');
    }
}
