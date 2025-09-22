<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $products = Product::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get();

        return Inertia::render('cadastro-produtos/Index', [
            'products' => $products
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'price' => $request->price
        ]);

        return back()->with([
            'success' => true,
            'message' => 'Produto cadastrado com sucesso!',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            abort(403, 'Acesso não autorizado.');
        }

        $product->delete();

        return back()->with([
            'success' => true,
            'message' => 'Produto removido com sucesso!'
        ]);
    }
}
