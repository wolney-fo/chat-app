import { z } from "zod";

export const sendMessageFormSchema = z.object({
  content: z.string().nonempty().trim(),
});

export type SendMessageFormSchema = z.infer<typeof sendMessageFormSchema>;
