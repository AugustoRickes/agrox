"use client";

import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tractor, CheckCircle, Trash2, ArrowLeft } from 'lucide-react';

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
        product?: Product;
    };
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function CadastrarPage({ products = [] }: Props) {
    const { flash, errors } = usePage<Props>().props;

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        price: ''
    });

    useEffect(() => {
        if (flash?.success) {
            alert(flash.message || 'Operação realizada com sucesso!');
        }
    }, [flash]);

    const handleRegisterProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name || !data.price) {
            alert('Por favor, preencha o nome do produto e o preço.');
            return;
        }

        post('/cadastro-produtos', {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.error('Erro ao cadastrar produto:', errors);
            }
        });
    };

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
            <Head title="Cadastro de Produtos" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Cabeçalho */}
                <header className="bg-white shadow-sm p-4">
                    <div className="flex items-center justify-between max-w-lg mx-auto">
                        <Link href="/" className="text-green-700 hover:text-green-500 transition-colors duration-200">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center gap-3 text-2xl font-bold text-green-800">
                            <Tractor className="w-7 h-7 text-green-600" />
                            Cadastro de Produto
                        </div>
                        <div className="w-6"></div> {/* Spacer para centralizar */}
                    </div>
                </header>

                {/* Conteúdo principal */}
                <main className="flex-1 p-6">
                    <div className="max-w-lg mx-auto space-y-6">
                        <Card className="border border-green-200 shadow-md">
                            <CardContent className="p-6">
                                <form onSubmit={handleRegisterProduct} className="space-y-6">
                                    <div>
                                        <Label htmlFor="produto" className="text-lg font-semibold text-gray-700 mb-2 block">Produto</Label>
                                        <Input
                                            id="produto"
                                            placeholder="Ex: Alface Crespa"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="bg-white border border-black text-black h-12 text-lg"
                                        />
                                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
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
                                        {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-green-600 text-white hover:bg-green-700 h-12 text-lg font-semibold"
                                    >
                                        {processing ? 'Salvando...' : 'Salvar Produto'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border border-green-200 shadow-md">
                            <CardContent className="p-6">
                                <Label className="text-lg font-semibold text-green-800 mb-4 block">
                                    Produtos Cadastrados ({products.length})
                                </Label>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {products.length > 0 ? (
                                        products.map((product: Product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-800">{product.name}</div>
                                                        <div className="text-green-600 font-semibold text-lg">
                                                            R$ {Number(product.price).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
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

                        <div className="text-sm text-center text-green-500 pt-2 italic">
                            ● Status: Sincronizado
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
