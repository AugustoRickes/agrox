"use client";

import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ArrowLeft } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface Props {
    product: Product;
    errors?: Record<string, string>;
}

export default function ProdutosEdit({ product }: Props) {
    const { errors } = usePage<Props>().props;

    const { data, setData, put, processing } = useForm({
        price: product.price.toString()
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.price) {
            alert('Por favor, preencha o preço.');
            return;
        }

        put(`/produtos/${product.id}`);
    };

    return (
        <>
            <Head title="Editar Produto" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <header className="bg-white shadow-sm p-4">
                    <div className="flex items-center justify-between max-w-lg mx-auto">
                        <Link href="/produtos" className="text-green-700 hover:text-green-500 transition-colors duration-200">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center gap-3 text-2xl font-bold text-green-800">
                            <Package className="w-7 h-7 text-green-600" />
                            Editar Produto
                        </div>
                        <div className="w-6"></div>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <div className="max-w-lg mx-auto space-y-6">
                        <Card className="border border-green-200 shadow-md">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="produto" className="text-lg font-semibold text-gray-700 mb-2 block">Produto</Label>
                                        <Input
                                            id="produto"
                                            value={product.name}
                                            disabled
                                            className="bg-gray-100 border border-gray-300 text-gray-600 h-12 text-lg"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">O nome do produto não pode ser alterado</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="price" className="text-lg font-semibold text-gray-700 mb-2 block">Preço (R$)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            id="price"
                                            placeholder="Ex: 15.50"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="bg-white border border-black text-black h-12 text-lg"
                                        />
                                        {errors?.price && <span className="text-red-500 text-sm mt-2 block">{errors.price}</span>}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-green-600 text-white hover:bg-green-700 h-12 text-lg font-semibold"
                                    >
                                        {processing ? 'Salvando...' : 'Atualizar Produto'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="text-sm text-center text-green-500 pt-2 italic">
                            ● Status: Sincronizado
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
