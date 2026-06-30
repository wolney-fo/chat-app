import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(1, "Informe seu nome."),
    email: z.email("E-mail inválido."),
    password: z.string().min(8, "A senha deve ter ao menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
