import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, TrendingUp, ShoppingCart, Package } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho */}
            <header className="bg-white shadow-sm p-4">
                <div className="flex items-center justify-between max-w-lg mx-auto">
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
            </header>

            {/* Conteúdo principal */}
            <main className="flex-1 p-6">
                <div className="max-w-lg mx-auto space-y-6">
                    {/* Boas-vindas */}
                    <div className="text-center py-6">
                        <p className="text-2xl font-extrabold text-green-900">Bem-vindo(a), Produtor!</p>
                        <p className="text-gray-600 mt-1">Organização que colhe sucesso.</p>
                    </div>

                    {/* Cards de navegação */}
                    <div className="space-y-6">
                        <Link href="/fluxo-de-caixa" className="block">
                            <Card className="w-full border border-green-200 shadow-md hover:shadow-lg rounded-xl cursor-pointer transition-shadow duration-300">
                                <CardContent className="flex items-center space-x-6 p-8">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-lg">Fluxo de Caixa</span>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/vendas" className="block">
                            <Card className="w-full border border-green-200 shadow-md hover:shadow-lg rounded-xl cursor-pointer transition-shadow duration-300">
                                <CardContent className="flex items-center space-x-6 p-8">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <ShoppingCart className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-lg">Venda</span>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/cadastro-produtos" className="block">
                            <Card className="w-full border border-green-200 shadow-md hover:shadow-lg rounded-xl cursor-pointer transition-shadow duration-300">
                                <CardContent className="flex items-center space-x-6 p-8">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <Package className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-lg">Produtos Cadastrados</span>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
