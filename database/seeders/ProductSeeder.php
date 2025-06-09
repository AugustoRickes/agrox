<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'Melancia pequena',
            'price' => 15
        ]);

        Product::create([
            'name' => 'Melancia média',
            'price' => 20
        ]);

        Product::create([
            'name' => 'Melancia grande',
            'price' => 30
        ]);

    }
}
