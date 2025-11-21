<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            if (!Schema::hasColumn('sales', 'offline_id')) {
                $table->string('offline_id')->nullable()->unique();
            }
            if (!Schema::hasColumn('sales', 'is_synced')) {
                $table->boolean('is_synced')->default(false);
            }
            if (!Schema::hasColumn('sales', 'synced_at')) {
                $table->timestamp('synced_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            if (Schema::hasColumn('sales', 'offline_id')) {
                $table->dropColumn('offline_id');
            }
            if (Schema::hasColumn('sales', 'is_synced')) {
                $table->dropColumn('is_synced');
            }
            if (Schema::hasColumn('sales', 'synced_at')) {
                $table->dropColumn('synced_at');
            }
        });
    }
};
