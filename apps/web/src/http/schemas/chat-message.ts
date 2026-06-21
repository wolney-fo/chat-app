import { z } from "zod";

export const chatMessageSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  chatId: z.string(),
  senderId: z.string(),
});

export const chatSocketEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("history"),
    messages: z.array(chatMessageSchema),
    lastFectedAt: z.coerce.date(),
  }),
  z.object({
    type: z.literal("message"),
    message: chatMessageSchema,
  }),
]);

export type ChatMessageSchema = z.infer<typeof chatMessageSchema>;
export type ChatSocketEventSchema = z.infer<typeof chatSocketEventSchema>;
