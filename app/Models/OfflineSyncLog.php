<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfflineSyncLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'sync_batch_id',
        'attempt_number',
        'status',
        'sales_data',
        'error_message',
        'attempted_at',
    ];

    protected $casts = [
        'sales_data' => 'array',
        'attempted_at' => 'datetime'
    ];
}
