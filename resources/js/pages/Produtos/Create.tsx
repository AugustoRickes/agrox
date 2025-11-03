"use client";

import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ArrowLeft } from 'lucide-react';

interface Props {
    errors?: Record<string, string>;
}

export default function ProdutosCreate() {
    const { errors } = usePage<Props>().props;

    const { data, setData, post, processing } = useForm({
        name: '',
        price: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name || !data.price) {
            alert('Por favor, preencha o nome do produto e o preço.');
            return;
        }

        post('/produtos');
    };

    return (
        <>
            <Head title="Cadastrar Produto" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <header className="bg-white shadow-sm p-4">
                    <div className="flex items-center justify-center max-w-lg mx-auto gap-5">
                        <Link href="/produtos" className="text-green-700 hover:text-green-500 transition-colors duration-200">
                            <ArrowLeft className="w-10 h-10" />
                        </Link>
                        <div className="flex items-center gap-3 text-4xl font-bold text-green-800">
                            <Package className="w-15 h-15 text-green-600" />
                            Cadastrar Produto
                        </div>
                        <div className="w-2"></div>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <div className="max-w-lg mx-auto space-y-6">
                        <Card className="border border-green-200 shadow-md">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="produto" className="text-3xl font-semibold text-gray-700 mb-2 block">Produto</Label>
                                        <Input
                                            id="produto"
                                            placeholder="Ex: Alface Crespa"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="bg-white border border-black text-black h-17 text-3xl"
                                        />
                                        {errors?.name && <span className="text-red-500 text-3xl mt-2 block">{errors.name}</span>}
                                    </div>

                                    <div>
                                        <Label htmlFor="price" className="text-3xl font-semibold text-gray-700 mb-2 block">Preço (R$)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            id="price"
                                            placeholder="Ex: 15.50"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="bg-white border border-black text-black h-17 text-3xl"
                                        />
                                        {errors?.price && <span className="text-red-500 text-3xl mt-2 block">{errors.price}</span>}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-green-600 text-white hover:bg-green-700 h-24 text-3xl font-semibold"
                                    >
                                        {processing ? 'Salvando...' : 'Salvar Produto'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="text-xl text-center text-green-500 pt-2 italic">
                            ● Status: Sincronizado
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
