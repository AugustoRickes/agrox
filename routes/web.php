<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SaleController;
use App\Models\Product;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/home', function () {
    return Inertia::render('Home/Index');
})->name('home');

Route::get('/vendas', function () {
    return Inertia::render('Vendas/Index', [
        'products' => Product::all()
    ]);
})->name('vendas');

// Rotas para vendas
Route::post('/vendas', [SaleController::class, 'store'])->name('vendas.store');
Route::get('/vendas/historico', [SaleController::class, 'index'])->name('vendas.index');

Route::get('/cadastro-produtos', function () {
    return Inertia::render('cadastro-produtos/Index');
})->name('cadastro-produtos');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
