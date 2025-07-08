<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ProductController;
use App\Models\Product;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', function () {
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

Route::get('/cadastro-produtos', [ProductController::class, 'index'])->name('cadastro-produtos');

// Rotas para produtos (protegidas por autenticação)
// Route::middleware('auth')->group(function () {
    Route::post('/cadastro-produtos', [ProductController::class, 'store'])->name('produtos.store');
    Route::delete('/produtos/{product}', [ProductController::class, 'destroy'])->name('produtos.destroy');
// });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
