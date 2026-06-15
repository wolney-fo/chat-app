import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { loginFormSchema, type LoginFormSchema } from "../http/schemas/login";
import { authenticate } from "../http/authenticate";

export function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormSchema) {
    try {
      await authenticate(data.email, data.password);
      await navigate({ to: "/" });
    } catch {
      setError("root", { message: "E-mail ou senha inválidos." });
    }
  }

  return (
    <div className="w-11/12 max-w-md space-y-6 p-8 border border-zinc-200 rounded-lg">
      <h2 className="font-bold text-2xl">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
        <label className="flex flex-col gap-1 space-y-2">
          E-mail
          <input
            type="email"
            autoFocus
            className={`p-2 border outline-none rounded-lg ${errors.email ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-indigo-500"}`}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 space-y-2">
          Password
          <input
            type="password"
            className={`p-2 border outline-none rounded-lg ${errors.password ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-indigo-500"}`}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
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
          className={`w-full py-4 mt-2 font-medium text-white rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${Object.keys(errors).length > 0 ? "bg-red-500" : "bg-indigo-500"}`}
        >
          {isSubmitting ? "Entrando..." : "Login"}
        </button>
      </form>
    </div>
  );
}
