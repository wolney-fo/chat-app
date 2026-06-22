import { z } from "zod";

export const newChatFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter ao menos 2 caracteres."),
  membersIds: z.array(z.string()).min(1, "Selecione ao menos um participante."),
});

export type NewChatFormSchema = z.infer<typeof newChatFormSchema>;
