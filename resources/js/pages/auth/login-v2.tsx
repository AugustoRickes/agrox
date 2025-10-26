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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6 ">
      <Head title="Log in" />

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
            Faça login para continuar organizando seu sucesso 🌱
          </p>
        </header>

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
              required
              autoFocus
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="h-17 bg-white border border-gray-300 rounded-xl px-4 focus-visible:ring-green-500 text-[25px]"
            />
            {errors.email && (
              <p className="text-lg text-red-500 mt-1">{errors.email}</p>
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
              autoComplete="current-password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="h-17 bg-white border border-gray-300 rounded-xl px-4 focus-visible:ring-green-500 text-[30px]"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {canResetPassword && (
            <div className="flex justify-end">
              <a
                href={route("password.request")}
                className="text-green-600 hover:text-green-700 hover:underline text-[25px] font-medium"
              >
                Esqueceu sua senha?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-[30px] flex items-center justify-center transition-colors duration-300"
          >
            {processing && (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            )}
            Entrar
          </button>

          <div className="text-center text-gray-700 text-[25px] sm:text-[20px]">
            Ainda não tem conta?{" "}
            <a
              href={route("register")}
              className="text-green-600 font-medium hover:underline"
            >
              Cadastre-se
            </a>
          </div>
        </form>

        {status && (
          <div className="text-center text-sm font-medium text-green-600">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
