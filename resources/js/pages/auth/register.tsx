import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { LoaderCircle } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function Register() {
    const { data, setData, post, processing, errors, reset, progress } =
        useForm({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
            <Head title="Register" />

            <div className="w-full max-w-md flex flex-col gap-8">
             
                <header className="flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-md">
                            <img
                                src="/agroxlogo.jpeg"
                                alt="AgroX Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-green-700">
                            AGROX
                        </h1>
                    </div>

                    <p className="text-gray-600 text-2xl text-center">
                        Crie sua conta e organize seu sucesso 🌱
                    </p>
                </header>

           
                <form onSubmit={submit} className="space-y-6 w-full">

          
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="name"
                            className="text-[25px] font-medium text-gray-700"
                        >
                            Nome
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome"
                            required
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="h-17 bg-white border border-gray-300 rounded-xl px-4 focus-visible:ring-green-500 text-[25px]"
                        />
                        {errors.name && (
                            <p className="text-lg text-red-500 mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="email"
                            className="text-[25px] font-medium text-gray-700"
                        >
                            E-mail
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemplo@agrox.com"
                            required
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="h-17 bg-white border border-gray-300 rounded-xl px-4 focus-visible:ring-green-500 text-[25px]"
                        />
                        {errors.email && (
                            <p className="text-lg text-red-500 mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="password"
                            className="text-[25px] font-medium text-gray-700"
                        >
                            Senha
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="h-17 bg-white border border-gray-300 rounded-xl px-4 focus-visible:ring-green-500 text-[30px]"
                        />
                        {errors.password && (
                            <p className="text-lg text-red-500 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

              
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="password_confirmation"
                            className="text-[25px] font-medium text-gray-700"
                        >
                            Confirmar senha
                        </label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={data.password_confirmation}
                            onChange={(a) =>
                                setData("password_confirmation", a.target.value)
                            }
                            className="h-17 bg-white border border-gray-300 rounded-xl px-4 focus-visible:ring-green-500 text-[30px]"
                        />
                        {errors.password_confirmation && (
                            <p className="text-lg text-red-500 mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

            
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-[30px] flex items-center justify-center transition-colors duration-300"
                    >
                        {processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                        )}
                        Criar conta
                    </button>

                    <div className="text-center text-gray-700 text-[25px] sm:text-[20px]">
                        Já tem uma conta?{" "}
                        <a
                            href={route("login")}
                            className="text-green-600 font-medium hover:underline"
                        >
                            Entrar
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
