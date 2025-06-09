import { Head, Link, useForm } from '@inertiajs/react';
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
import { Leaf } from "lucide-react";
import { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface Props {
    products: Product[];
}

export default function VendaForm({ products = [] }: Props) {
    const [calculatedChange, setCalculatedChange] = useState(0);
    const [total, setTotal] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        quantity: 1,
        payment_type: '',
        received_amount_cash: '',
    });

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

        if (data.payment_type === 'cash' && parseFloat(data.received_amount_cash) < total) {
            alert('Valor recebido é menor que o total da venda');
            return;
        }

        post('/vendas', {
            onSuccess: (response) => {
                alert('Venda realizada com sucesso!');
                // Reset form
                reset();
                setTotal(0);
                setCalculatedChange(0);
            },
            onError: (errors) => {
                console.error('Erro na venda:', errors);
                if (errors.message) {
                    alert(errors.message);
                }
            }
        });
    };

    return (
        <>
            <Head title="Vendas" />
            <div className="min-h-screen bg-white flex items-center justify-center p-3">
                <Card className="w-full max-w-md border border-2 shadow-xl">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-2xl font-bold text-green-800">
                                <Leaf className="w-6 h-6 text-green-600" />
                                Venda
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="produto">Produto</Label>
                                <Select
                                    value={data.product_id}
                                    onValueChange={(value) => setData('product_id', value)}
                                >
                                    <SelectTrigger className="bg-white border border-black text-black">
                                        <SelectValue placeholder="Selecione um produto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => {
                                            // Garantir que price seja tratado como número
                                            const price = typeof product.price === 'string' ?
                                                parseFloat(product.price) :
                                                Number(product.price);

                                            return (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name} - R$ {price.toFixed(2)}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                {errors.product_id && <span className="text-red-500 text-sm">{errors.product_id}</span>}
                            </div>

                            <div>
                                <Label htmlFor="quantity">Quantidade</Label>
                                <Input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', parseInt(e.target.value) || 1)}
                                    className="bg-white border border-black text-black"
                                />
                                {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
                            </div>

                            <div>
                                <Label htmlFor="total">Total</Label>
                                <Input
                                    type="text"
                                    id="total"
                                    value={`R$ ${total.toFixed(2)}`}
                                    readOnly
                                    className="bg-gray-100 border border-black text-black font-semibold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Forma de Pagamento</Label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
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
                                        />
                                        <Label htmlFor="pix">PIX</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="dinheiro"
                                            checked={data.payment_type === 'cash'}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setData('payment_type', 'cash');
                                                }
                                            }}
                                        />
                                        <Label htmlFor="dinheiro">Dinheiro</Label>
                                    </div>
                                </div>
                                {errors.payment_type && <span className="text-red-500 text-sm">{errors.payment_type}</span>}
                            </div>

                            {data.payment_type === 'cash' && (
                                <div className="space-y-3">
                                    <div>
                                        <Label>Valor Recebido</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="R$ 0,00"
                                            value={data.received_amount_cash}
                                            onChange={(e) => setData('received_amount_cash', e.target.value)}
                                            className="bg-white border border-black text-black"
                                        />
                                        {errors.received_amount_cash && <span className="text-red-500 text-sm">{errors.received_amount_cash}</span>}
                                    </div>

                                    <div>
                                        <Label>Troco</Label>
                                        <Input
                                            type="text"
                                            value={`R$ ${calculatedChange.toFixed(2)}`}
                                            readOnly
                                            className={`border border-black font-semibold ${
                                                calculatedChange > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-black'
                                            }`}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.product_id || !data.payment_type}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {processing ? 'Processando...' : 'Finalizar Venda'}
                                </Button>
                                <Button
                                    type="button"
                                    asChild
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 border border-black text-black"
                                >
                                    <Link href="/home">Cancelar</Link>
                                </Button>
                            </div>
                        </form>

                        <div className="text-xs text-center text-green-500 pt-2 italic">
                            ● Status: sincronizado
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
