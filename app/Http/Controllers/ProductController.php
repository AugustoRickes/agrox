<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $products = Product::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get();

        return Inertia::render('Produtos/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        return Inertia::render('Produtos/Create');
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

        return redirect()->route('produtos.index')->with([
            'success' => true,
            'message' => 'Produto cadastrado com sucesso!',
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            abort(403, 'Acesso não autorizado.');
        }

        return Inertia::render('Produtos/Edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            abort(403, 'Acesso não autorizado.');
        }

        $request->validate([
            'price' => 'required|numeric|min:0|max:999999.99'
        ], [
            'price.required' => 'O preço do produto é obrigatório.',
            'price.numeric' => 'O preço deve ser um valor numérico.',
            'price.min' => 'O preço deve ser maior ou igual a zero.',
            'price.max' => 'O preço não pode ser maior que R$ 999.999,99.'
        ]);

        $product->update([
            'price' => $request->price
        ]);

        return redirect()->route('produtos.index')->with([
            'success' => true,
            'message' => 'Produto atualizado com sucesso!'
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
