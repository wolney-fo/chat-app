import { z } from "zod";

export const chatSchema = z.object({
  _id: z.string(),
  name: z.string(),
  lastMessage: z
    .object({
      content: z.string(),
      createdAt: z.coerce.date(),
    })
    .nullable(),
});

export const chatsSocketEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("history"),
    chats: z.array(chatSchema),
    lastFectedAt: z.coerce.date(),
  }),
  z.object({
    type: z.literal("chat"),
    chat: chatSchema,
  }),
]);

export type ChatSchema = z.infer<typeof chatSchema>;
export type ChatsSocketEventSchema = z.infer<typeof chatsSocketEventSchema>;
