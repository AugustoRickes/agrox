<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pegar o usuário teste para associar os produtos
        $user = User::where('email', 'test@example.com')->first();
        
        if (!$user) {
            return;
        }

        Product::create([
            'user_id' => $user->id,
            'name' => 'Melancia pequena',
            'price' => 15
        ]);

        Product::create([
            'user_id' => $user->id,
            'name' => 'Melancia média',
            'price' => 20
        ]);

        Product::create([
            'user_id' => $user->id,
            'name' => 'Melancia grande',
            'price' => 30
        ]);
    }
}
