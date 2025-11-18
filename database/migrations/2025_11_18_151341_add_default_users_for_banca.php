<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        User::create(attributes: [
            'name'=>'Admin banca',
            'email'=>'admin@banca.com',
            'password'=>123456,
            'is_admin'=>true,
            'is_active'=>true,
        ]);

        User::create(attributes: [
            'name'=>'Banca agrox',
            'email'=>'banca@agrox.com',
            'password'=>123456,
            'is_admin'=>false,
            'is_active'=>true,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->where('email','admin@banca.com')->delete();
        DB::table('users')->where('email','banca@agrox.com')->delete();
    }
};
