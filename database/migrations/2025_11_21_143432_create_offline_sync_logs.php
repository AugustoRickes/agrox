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
        Schema::create('offline_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->string('sync_batch_id');
            $table->integer('attempt_number');
            $table->enum('status', ['pending', 'success', 'failed']);
            $table->text('sales_data'); // JSON das vendas
            $table->text('error_message')->nullable();
            $table->timestamp('attempted_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offline_sync_logs');
    }
};
