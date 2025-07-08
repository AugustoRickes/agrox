"use client";

import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tractor, CheckCircle, Trash2 } from 'lucide-react';

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
            <div className="min-h-screen bg-white flex items-center justify-center p-3">
                <Card className="w-full max-w-md border-2 shadow-xl">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-2 text-2xl font-bold text-green-800">
                            <Tractor className="w-8 h-8 text-green-600" />
                            <span>Cadastro de Produto</span>
                        </div>

                        <form onSubmit={handleRegisterProduct} className="space-y-4">
                            <div>
                                <Label htmlFor="produto">Produto</Label>
                                <Input
                                    id="produto"
                                    placeholder="Ex: Alface Crespa"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="bg-white border border-black text-black"
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            </div>

                            <div>
                                <Label htmlFor="price">Preço (R$)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    id="price"
                                    placeholder="Ex: 15.50"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="bg-white border border-black text-black"
                                />
                                {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                            </div>

                            <div className="flex gap-8 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                >
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                                <Button
                                    type="button"
                                    asChild
                                    className="flex-1 bg-gray-100 border border-black text-black hover:bg-gray-200"
                                >
                                    <Link href="/">Cancelar</Link>
                                </Button>
                            </div>
                        </form>

                        <div>
                            <Label className="text-base font-semibold text-green-800">
                                Produtos Cadastrados ({products.length})
                            </Label>
                            <div className="space-y-1 mt-2 max-h-40 overflow-y-auto">
                                {products.length > 0 ? (
                                    products.map((product: Product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between border-b py-2 text-sm text-gray-800"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>{product.name}</span>
                                                <span className="text-green-600 font-semibold">
                                                    R$ {Number(product.price).toFixed(2)}
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="italic text-gray-500 mt-2">
                                        Nenhum produto cadastrado.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-xs text-center text-green-500 pt-2 italic">
                            ● Status: Sincronizado
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
