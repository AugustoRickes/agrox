import { Head, Link } from '@inertiajs/react';
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

export default function VendaForm() {
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

                        <div>
                            <Label htmlFor="produto">Produto</Label>
                            <Select>
                                <SelectTrigger className="bg-white border border-black text-black">
                                    <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mel">Mel</SelectItem>
                                    <SelectItem value="geleia">Geleia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="valorProduto">Valor</Label>
                            <Input
                                type="number"
                                id="valorProduto"
                                placeholder="R$ 0,00"
                                className="bg-white border border-black text-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Forma de Pagamento</Label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="pix" />
                                    <Label htmlFor="pix">PIX</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="dinheiro" />
                                    <Label htmlFor="dinheiro">Dinheiro</Label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="space-y-0.5">
                                <Label>Valor Recebido</Label>
                                <Input
                                    type="number"
                                    placeholder="R$ 0,00"
                                    className="bg-white border border-black text-black"
                                />
                            </div>

                            <div className="space-y-0.5">
                                <Label>Troco</Label>
                                <Input
                                    type="number"
                                    placeholder="R$ 0,00"
                                    className="bg-white border border-black text-black"
                                />
                            </div>
                        </div>

                        <div className="flex gap-8 pt-4">
                            <Button className="flex-1 bg-green-600 text-white">
                                Salvar
                            </Button>
                            <Button asChild className="flex-1 bg-gray-100 border border-black text-black">
                                <Link href="/home">Cancelar</Link>
                            </Button>
                        </div>

                        <div className="text-xs text-center text-green-500 pt-2 italic">
                            ● Status: sincronizado
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
