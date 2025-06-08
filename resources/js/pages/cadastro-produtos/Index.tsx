"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tractor, CheckCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function CadastrarPage() {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('');
    const [registeredProducts, setRegisteredProducts] = useState(['Mel', 'Arroz', 'Café']);

    const handleRegisterProduct = () => {
        if (productName && unit) {
            setRegisteredProducts([...registeredProducts, productName]);
            setProductName('');
            setDescription('');
            setUnit('');
            console.log('Produto cadastrado:', { productName, description, unit });
        } else {
            alert('Por favor, preencha o nome do produto e a unidade.');
        }
    };

    // Array de números de 1 a 100 para o select
    const quantities = Array.from({ length: 100 }, (_, i) => i + 1);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-3">
            <Card className="w-full max-w-md border-2 shadow-xl">
                <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-2 text-2xl font-bold text-green-800">
                        <Tractor className="w-8 h-8 text-green-600" />
                        <span> Cadastro de Produto</span>
                    </div>


                    <div>
                        <Label htmlFor="produto">Produto</Label>
                        <Input
                            id="produto"
                            placeholder="Ex: Alface Crespa"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="bg-white border border-black text-black"
                        />
                    </div>


                    <div>
                        <Label htmlFor="quantidade">Quantidade</Label>
                        <Select onValueChange={setUnit} value={unit}>
                            <SelectTrigger
                                id="quantidade"
                                className="bg-white border border-black text-black"
                            >
                                <SelectValue placeholder="Selecione a quantidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {quantities.map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                        {num}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    <div>
                        <Label className="text-base font-semibold text-green-800">Produtos Cadastrados</Label>
                        <ul className="space-y-1 mt-2 max-h-40 overflow-y-auto">
                            {registeredProducts.length > 0 ? (
                                registeredProducts.map((product, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center justify-between border-b py-2 text-sm text-gray-800"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>{product}</span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="italic text-gray-500 mt-2">Nenhum produto cadastrado.</li>
                            )}
                        </ul>
                    </div>


                    <div className="flex gap-8 pt-4">
                        <Button
                            className="flex-1 bg-green-600 text-white"
                            onClick={handleRegisterProduct} >
                            Salvar
                        </Button>
                        <Link href="/home">
                            <Button
                                className="flex-1 bg-gray-100 border border-black text-black"
                                onClick={() => {
                                    setProductName('');
                                    setDescription('');
                                    setUnit('');
                                }}
                            >
                                Cancelar
                            </Button>
                        </Link>
                    </div>

                    <div className="text-xs text-center text-green-500 pt-2 italic">
                        ● Status: Sincronizado
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
