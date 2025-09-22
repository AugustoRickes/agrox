<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@agrox.com'],
            [
                'name' => 'Administrador AgroX',
                'email' => 'admin@agrox.com',
                'password' => '123456',
                'email_verified_at' => now(),
                'is_admin' => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Usuário Teste',
                'email' => 'test@example.com',
                'password' => '123456',
                'email_verified_at' => now(),
            ]
        );
    }
}
