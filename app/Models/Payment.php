<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'type',
        'amount',
        'received_amount_cash',
        'change_cash',
        'is_synced',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'received_amount_cash' => 'decimal:2',
        'change_cash' => 'decimal:2',
        'is_synced' => 'boolean',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
