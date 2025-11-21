<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CashFlowController;
use App\Http\Controllers\SyncController;
use App\Models\Product;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/sync/sales', [SyncController::class, 'syncSales'])->name('sync.sales');
    Route::get('/sync/status', [SyncController::class, 'syncStatus'])->name('sync.status');

    Route::get('/', function () {
        return Inertia::render('Home/Index');
    })->name('home');

    Route::get('/vendas', function () {
        return Inertia::render('Vendas/Index', [
            'products' => Product::where('user_id', auth()->id())->get()
        ]);
    })->name('vendas');

    // Rotas para vendas
    Route::post('/vendas', [SaleController::class, 'store'])->name('vendas.store');
    Route::get('/vendas/historico', [SaleController::class, 'index'])->name('vendas.index');

    // Rotas para produtos
    Route::get('/produtos', [ProductController::class, 'index'])->name('produtos.index');
    Route::get('/produtos/criar', [ProductController::class, 'create'])->name('produtos.create');
    Route::post('/produtos', [ProductController::class, 'store'])->name('produtos.store');
    Route::get('/produtos/{product}/editar', [ProductController::class, 'edit'])->name('produtos.edit');
    Route::put('/produtos/{product}', [ProductController::class, 'update'])->name('produtos.update');
    Route::delete('/produtos/{product}', [ProductController::class, 'destroy'])->name('produtos.destroy');

    Route::get('fluxo-de-caixa', [CashFlowController::class, 'index'])->name('fluxo-de-caixa');

    Route::get('fluxo-de-caixa/ciclos', function () {
        return Inertia::render('Fluxo-de-caixa/Ciclos');
    })->name('fluxo-de-caixa.ciclos');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
