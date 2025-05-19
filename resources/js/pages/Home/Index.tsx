import { Head } from '@inertiajs/react';
import { HiOutlineCash, HiOutlineShoppingCart, HiOutlineArchive } from 'react-icons/hi';
import { Link } from '@inertiajs/react';

export default function HomePage() {
    return (
        <>
            <Head title="Home" />
            <div className="min-h-screen bg-white flex items-center justify-center p-10">
                <div className="w-full max-w-sm bg-white border-2 rounded-lg shadow-lg flex flex-col items-center p-12">

                    {/* Logo */}
                    <div className="mb-6">
                        <img src="/agroxlogo.jpeg" alt="Logo" className="w-15 h-auto mx-auto" />
                    </div>

                    {/* Menu de Opções */}
                    <div className="flex flex-col items-center space-y-10 w-full">

                        {/* Fluxo de Caixa */}
                        <div className="bg-gray-50 shadow-lg border border-gray-300 rounded-lg w-full p-8 text-center">
                            <div className="flex items-center justify-center space-x-4">
                                <HiOutlineCash className="text-4xl text-green-600" />
                                <h3 className="text-2xl font-semibold">Fluxo de Caixa</h3>
                            </div>
                        </div>

                        {/* Vendas (com link para a rota /vendas) */}
                        <Link href="/vendas" className="w-full">
                            <div className="bg-gray-50 shadow-lg border border-gray-300 rounded-lg w-full p-10 text-center hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-center space-x-4">
                                    <HiOutlineShoppingCart className="text-4xl text-blue-600" />
                                    <h3 className="text-2xl font-semibold">Vendas</h3>
                                </div>
                            </div>
                        </Link>

                        {/* Produtos Cadastrados */}
                        <div className="bg-gray-50 shadow-lg border border-gray-300 rounded-lg w-full p-6 text-center">
                            <div className="flex items-center justify-center space-x-4">
                                <HiOutlineArchive className="text-4xl text-yellow-600" />
                                <h3 className="text-2xl font-semibold">Produtos Cadastrados</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
