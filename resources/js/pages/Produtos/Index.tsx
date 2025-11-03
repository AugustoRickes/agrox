"use client";

import React, { useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Edit2, Trash2, ArrowLeft, Plus } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    created_at: string;
}

interface Props {
    products: Product[];
    flash?: {
        success?: boolean;
        message?: string;
    };
}

export default function ProdutosIndex({ products = [] }: Props) {
    const { flash } = usePage<Props>().props;

    useEffect(() => {
        if (flash?.success) {
            alert(flash.message || 'Operação realizada com sucesso!');
        }
    }, [flash]);

    const handleDeleteProduct = (productId: number) => {
        if (confirm('Tem certeza que deseja remover este produto?')) {
            router.delete(`/produtos/${productId}`, {
                onError: (error) => {
                    console.error('Erro ao remover produto:', error);
                    alert('Erro ao remover produto.');
                }
            });
        }
    };

    return (
        <>
            <Head title="Produtos Cadastrados" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <header className="bg-white shadow-sm p-4">
                    <div className="flex items-center justify-between max-w-lg mx-auto gap-3">
                        <Link href="/" className="text-green-700 hover:text-green-500 transition-colors duration-200">
                            <ArrowLeft className="w-10 h-10" />
                        </Link>
                        <div className="flex items-center gap-3 text-4xl font-bold text-green-800">
                            <Package className="w-15 h-15 text-green-600" />
                            Produtos Cadastrados
                        </div>
                        <div className="w-2"></div>
                    </div>
                </header>

                <main className="flex-1 p-3">
                    <div className="max-w-lg mx-auto space-y-6">
                        

                        <Card className="border border-green-200 shadow-md">
                            <CardContent className="p-3">
                                <div className="mb-4">
                                    <h2 className="text-3xl font-semibold text-green-800">
                                        Total de Produtos: {products.length}
                                    </h2>
                                </div>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {products.length > 0 ? (
                                        products.map((product: Product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-gray-50"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800 text-3xl">{product.name}</div>
                                                    <div className="text-green-600 font-semibold text-3xl">
                                                        R$ {Number(product.price).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Link href={`/produtos/${product.id}/editar`}>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 "
                                                        >
                                                            <Edit2 className="w-15 h-15" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-15 h-15" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 italic">
                                            Nenhum produto cadastrado ainda.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                    <Link href="/produtos/criar">
                        <Button className=" w-full bg-green-600 text-white hover:bg-green-700 h-26 text-[27px] font-bold py-6">
                            <Plus className="w-5 h-5 mr-1" />
                            Cadastrar Novo Produto
                        </Button>
                    </Link>
                        <div className="text-xl text-center text-green-500 pt-2 italic">
                            ● Status: Sincronizado
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
