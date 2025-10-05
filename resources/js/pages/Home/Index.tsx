import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card'; // shadcn/ui
import { Menu, TrendingUp, ShoppingCart, Package } from 'lucide-react'; // ícones

export default function HomePage() {
    const userName = "Produtor"; // essa linha é necessaria?

    return (
            <Card className="w-full max-w-md border-2 shadow-xl">
                <CardContent className="p-6 space-y-6">
                    {/* Cabeçalho */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
                                <img
                                    src="/agroxlogo.jpeg"
                                    alt="Logo AgroX"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h1 className="text-xl font-bold text-green-800">AgroX</h1>
                        </div>
                        <Menu className="w-7 h-7 text-green-700 cursor-pointer hover:text-green-500 transition-colors duration-200" />
                    </div>

                    {/* Boas-vindas */}
                    <div className="text-center">
                        <p className="text-2xl font-extrabold text-green-900">Bem-vindo(a), Produtor!</p>
                        <p className="text-gray-600 mt-1">Organização que colhe sucesso.</p>
                    </div>

                    {/* Cards de navegação */}
                    <div className="space-y-4">
                        <Link href="/fluxo-de-caixa" className="block">
                            <Card className="w-full border border-green-200 shadow-md hover:shadow-lg rounded-xl cursor-pointer transition-shadow duration-300">
                                <CardContent className="flex items-center space-x-4 p-5">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-lg">Fluxo de Caixa</span>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/vendas" className="block">
                            <Card className="w-full border border-green-200 shadow-md hover:shadow-lg rounded-xl cursor-pointer transition-shadow duration-300">
                                <CardContent className="flex items-center space-x-4 p-5">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <ShoppingCart className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-lg">Venda</span>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/cadastro-produtos" className="block">
                            <Card className="w-full border border-green-200 shadow-md hover:shadow-lg rounded-xl cursor-pointer transition-shadow duration-300">
                                <CardContent className="flex items-center space-x-4 p-5">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <Package className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-lg">Produtos Cadastrados</span>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </CardContent>
            </Card>
    );
}
