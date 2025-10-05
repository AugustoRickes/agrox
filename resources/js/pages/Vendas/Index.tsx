import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, ArrowLeft } from "lucide-react";
import { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface Props {
    products: Product[];
    flash?: {
        success?: boolean;
        message?: string;
        sale_data?: {
            sale_id: number;
            total_amount: number;
            change: number;
        };
    };
}

export default function VendaForm({ products = [] }: Props) {
    const [calculatedChange, setCalculatedChange] = useState(0);
    const [total, setTotal] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const { flash, errors } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        product_id: '',
        quantity: 1,
        payment_type: '',
        received_amount_cash: '',
    });

    // Exibir mensagem de sucesso da sessão
    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            setTimeout(() => {
                alert(flash.message || 'Venda realizada com sucesso!');
                if (flash?.sale_data?.change > 0) {
                    alert(`Troco: R$ ${flash.sale_data.change.toFixed(2)}`);
                }
                setShowSuccess(false);
            }, 100);
        }
    }, [flash]);

    // Calcula o total quando produto ou quantidade mudam
    useEffect(() => {
        if (data.product_id && data.quantity) {
            const selectedProduct = products.find(p => p.id.toString() === data.product_id);
            if (selectedProduct) {
                const price = Number(selectedProduct.price);
                const newTotal = price * data.quantity;
                setTotal(newTotal);
            }
        } else {
            setTotal(0);
        }
    }, [data.product_id, data.quantity, products]);

    // Calcula o troco quando valor recebido muda
    useEffect(() => {
        if (data.payment_type === 'cash' && data.received_amount_cash && total > 0) {
            const receivedAmount = parseFloat(data.received_amount_cash);
            const change = receivedAmount - total;
            setCalculatedChange(change >= 0 ? change : 0);
        } else {
            setCalculatedChange(0);
        }
    }, [data.received_amount_cash, data.payment_type, total]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validação básica no frontend
        if (!data.product_id) {
            alert('Selecione um produto');
            return;
        }

        if (data.payment_type === 'cash' && data.received_amount_cash && parseFloat(data.received_amount_cash) < total) {
            alert('Valor recebido é menor que o total da venda');
            return;
        }

        post('/vendas', {
            onSuccess: (page) => {
                // Reset form após sucesso
                reset();
                setTotal(0);
                setCalculatedChange(0);

                // Mostrar mensagem de sucesso imediata
                setTimeout(() => {
                    alert('Venda realizada com sucesso!');
                    if (data.payment_type === 'cash' && calculatedChange > 0) {
                        alert(`Troco: R$ ${calculatedChange.toFixed(2)}`);
                    }
                }, 200);
            },
            onError: (errors) => {
                console.error('Erro na venda:', errors);
                alert('Erro ao processar venda. Tente novamente.');
            }
        });
    };

    return (
        <>
            <Head title="Vendas" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Cabeçalho */}
                <header className="bg-white shadow-sm p-4">
                    <div className="flex items-center justify-between max-w-lg mx-auto">
                        <Link href="/" className="text-green-700 hover:text-green-500 transition-colors duration-200">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center gap-3 text-2xl font-bold text-green-800">
                            <Leaf className="w-7 h-7 text-green-600" />
                            Venda
                        </div>
                        <div className="w-6"></div> {/* Spacer para centralizar */}
                    </div>
                </header>

                {/* Conteúdo principal */}
                <main className="flex-1 p-6 flex flex-col">
                    <div className="max-w-lg mx-auto flex-1 flex flex-col">
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                            <div className="space-y-8 flex-1">
                                <div>
                                    <Label htmlFor="produto" className="text-lg font-semibold text-gray-700 mb-3 block">Produto</Label>
                                    <Select
                                        value={data.product_id}
                                        onValueChange={(value) => setData('product_id', value)}
                                    >
                                        <SelectTrigger className="bg-white border border-black text-black h-16 text-xl px-6">
                                            <SelectValue placeholder="Selecione um produto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((product) => {
                                                const price = Number(product.price) || 0;
                                                return (
                                                    <SelectItem key={product.id} value={product.id.toString()} className="text-xl py-4">
                                                        {product.name} - R$ {price.toFixed(2)}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {errors.product_id && <span className="text-red-500 text-sm mt-2 block">{errors.product_id}</span>}
                                </div>

                                <div>
                                    <Label htmlFor="quantity" className="text-lg font-semibold text-gray-700 mb-3 block">Quantidade</Label>
                                    <div className="flex items-center justify-center gap-4">
                                        <Button
                                            type="button"
                                            onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}
                                            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white text-2xl font-bold"
                                            disabled={data.quantity <= 1}
                                        >
                                            -
                                        </Button>
                                        <div className="flex-1 text-center">
                                            <div className="text-3xl font-bold text-gray-800 bg-gray-100 rounded-lg py-3 border border-gray-300">
                                                {data.quantity}
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => setData('quantity', data.quantity + 1)}
                                            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold"
                                        >
                                            +
                                        </Button>
                                    </div>
                                    {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
                                </div>

                                <Card className="border border-green-200 shadow-md">
                                    <CardContent className="p-6">
                                        <Label htmlFor="total" className="text-lg font-semibold text-gray-700 mb-2 block">Total</Label>
                                        <div className="text-3xl font-bold text-green-600 text-center py-4">
                                            R$ {total.toFixed(2)}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    <Label className="text-xl font-semibold text-gray-700 block">Forma de Pagamento</Label>
                                    <div className="flex items-center gap-8 justify-center">
                                        <div className="flex items-center gap-4">
                                            <Checkbox
                                                id="pix"
                                                checked={data.payment_type === 'pix'}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData({
                                                            ...data,
                                                            payment_type: 'pix',
                                                            received_amount_cash: ''
                                                        });
                                                    }
                                                }}
                                                className="w-10 h-10"
                                            />
                                            <Label htmlFor="pix" className="text-xl font-medium">PIX</Label>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Checkbox
                                                id="dinheiro"
                                                checked={data.payment_type === 'cash'}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('payment_type', 'cash');
                                                    }
                                                }}
                                                className="w-10 h-10"
                                            />
                                            <Label htmlFor="dinheiro" className="text-xl font-medium">Dinheiro</Label>
                                        </div>
                                    </div>
                                    {errors.payment_type && <span className="text-red-500 text-sm">{errors.payment_type}</span>}
                                </div>

                                {data.payment_type === 'cash' && (
                                    <Card className="border border-green-200 shadow-md">
                                        <CardContent className="p-6 space-y-4">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-700 mb-2 block">Valor Recebido</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="R$ 0,00"
                                                    value={data.received_amount_cash}
                                                    onChange={(e) => setData('received_amount_cash', e.target.value)}
                                                    className="bg-white border border-black text-black h-12 text-lg"
                                                />
                                                {errors.received_amount_cash && <span className="text-red-500 text-sm">{errors.received_amount_cash}</span>}
                                            </div>

                                            <div>
                                                <Label className="text-lg font-semibold text-gray-700 mb-2 block">Troco</Label>
                                                <div className={`text-2xl font-bold text-center py-3 rounded-lg ${
                                                    calculatedChange > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    R$ {calculatedChange.toFixed(2)}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {errors.general && (
                                    <div className="text-red-500 text-sm text-center">
                                        {errors.general}
                                    </div>
                                )}
                            </div>

                            {/* Botão fixo no bottom */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                {showSuccess && (
                                    <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-center">
                                        Venda processada com sucesso!
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    disabled={processing || !data.product_id || !data.payment_type}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white h-16 text-xl font-bold disabled:opacity-50"
                                >
                                    {processing ? 'Processando...' : 'Finalizar Venda'}
                                </Button>
                            </div>
                        </form>

                        <div className="text-sm text-center text-green-500 pt-4 italic">
                            ● Status: sincronizado
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
