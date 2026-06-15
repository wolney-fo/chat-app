import { z } from "zod";

export const chatsListSchema = z.object({
  chats: z.array(
    z.object({
      _id: z.string(),
      name: z.string(),
      lastMessage: z
        .object({
          content: z.string(),
          createdAt: z.coerce.date(),
        })
        .optional(),
    }),
  ),
});
