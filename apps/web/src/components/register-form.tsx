import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  registerFormSchema,
  type RegisterFormSchema,
} from "../http/schemas/register-form";
import { register } from "../http/register";
import { authenticate } from "../http/authenticate";

export function RegisterForm() {
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormSchema) {
    try {
      await register(data);
      await authenticate(data.email, data.password);
      await navigate({ to: "/" });
    } catch (err) {
      if (err instanceof Error && err.message === "email_conflict") {
        setError("email", { message: "Este e-mail já está em uso." });
      } else {
        setError("root", { message: "Não foi possível criar a conta." });
      }
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="w-11/12 max-w-md space-y-6 p-8 border border-zinc-200 rounded-lg">
      <h2 className="font-bold text-2xl">Criar conta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
        <label className="flex flex-col gap-1 space-y-2">
          Nome
          <input
            type="text"
            autoFocus
            className={`p-2 border outline-none rounded-lg ${errors.name ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-indigo-500"}`}
            {...registerField("name")}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 space-y-2">
          E-mail
          <input
            type="email"
            className={`p-2 border outline-none rounded-lg ${errors.email ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-indigo-500"}`}
            {...registerField("email")}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 space-y-2">
          Senha
          <input
            type="password"
            className={`p-2 border outline-none rounded-lg ${errors.password ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-indigo-500"}`}
            {...registerField("password")}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 space-y-2">
          Confirmar senha
          <input
            type="password"
            className={`p-2 border outline-none rounded-lg ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-indigo-500"}`}
            {...registerField("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>

        {errors.root && (
          <p className="text-sm text-red-500 text-center">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 mt-2 font-medium text-white rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${hasErrors ? "bg-red-500" : "bg-indigo-500"}`}
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="text-sm text-center text-zinc-500">
        Já tem conta?{" "}
        <Link to="/login" className="font-medium text-indigo-500 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
