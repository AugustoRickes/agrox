import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";
import { Input } from "@/components/ui/input";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
            <Head title="Esqueci a senha" />

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
                        Recuperar acesso 🌱
                    </p>
                </header>

            
                {status && (
                    <div className="text-center text-[20px] font-medium text-green-600">
                        {status}
                    </div>
                )}

           
                <form onSubmit={submit} className="space-y-6 w-full">
               
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
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData("email", e.target.value)}
                            className="h-20 bg-white border border-gray-300 rounded-xl px-4 focus-visible:ring-green-500 text-[25px]"
                        />

                        {errors.email && (
                            <p className="text-lg text-red-500 mt-1">
                                {errors.email}
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
                        Enviar link de redefinição
                    </button>

              
                    <div className="text-center text-gray-700 text-[25px] sm:text-[20px]">
                        Lembrou sua senha?{" "}
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
