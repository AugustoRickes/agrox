import React, { FormEventHandler, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";

export default function Login({ status, canResetPassword = true }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const { props } = usePage();

  useEffect(() => {
    const { success, error } = props as { success?: string; error?: string };
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [props]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password"),
      onError: (errors) => {
        if (errors.email) toast.error(errors.email);
      },
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-2">
      <Head title="Log in" />

      <form
        onSubmit={submit}
        className="w-[390px] min-h-[300px] bg-white border-[6px] border-gray-200 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col items-center px-4 py-4"
      >
        <header className="w-full flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <img src="/agroxlogo.jpeg" alt="AgroX Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-semibold text-green-700">AgroX</h1>
          </div>
        </header>

        <div className="text-center mb-3">
          <h2 className="text-xl font-semibold text-green-800">
            Bem-vindo(a) de volta!
          </h2>
          <p className="text-gray-500 text-sm">
            Faça login para continuar organizando seu sucesso 🌱
          </p>
        </div>

        <div className="w-full space-y-5">
          {/* Campo de email */}
          <div className="flex items-center gap-3 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex-1">
              <label
                htmlFor="email"
                className="block text-[17px] font-medium text-gray-700 mb-1"
              >
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@agrox.com"
                required
                autoFocus
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="focus-visible:ring-green-500 border-none bg-transparent p-0"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Campo de senha */}
          <div className="flex items-center gap-3 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex-1">
              <label
                htmlFor="password"
                className="block text-[17px] font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="focus-visible:ring-green-500 border-none bg-transparent p-0"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Esqueceu senha */}
          {canResetPassword && (
            <div className="flex justify-end">
              <a
                href={route("password.request")}
                className="text-lg text-green-600 hover:underline font-medium"
              >
                Esqueceu sua senha?
              </a>
            </div>
          )}

          {/* Botão de login */}
          <div className="border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium text-[17px] flex items-center justify-center"
            >
              {processing && (
                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
              )}
              Entrar
            </button>
          </div>

          {/* Link de registro */}
          <div className="border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 text-center">
            <p className="text-[17px] text-gray-600">
              Ainda não tem conta?{" "}
              <a
                href={route("register")}
                className="text-green-600 font-medium hover:underline"
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </div>

        {/* Mensagem de status */}
        {status && (
          <div className="mt-4 text-center text-sm font-medium text-green-600">
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
