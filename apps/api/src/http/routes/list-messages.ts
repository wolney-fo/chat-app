import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { z } from "zod";
import { chats, messages } from "../../database/mongo-client";
import { ObjectId } from "mongodb";
import { messaging } from "../../utils/messaging-pub-sub";

export async function listMessages(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/chats/:chatId/messages",
    {
      websocket: true,
      onRequest: [verifyJWT],
      schema: {
        params: z.object({
          chatId: z.string(),
        }),
      },
    },
    async (socket, request) => {
      const { sub } = request.user;
      const { chatId } = request.params;

      const chat = await chats.findOne({
        _id: new ObjectId(chatId),
        members: new ObjectId(sub),
      });

      if (!chat) {
        socket.close(1008, "Chat not found");
        return;
      }

      const existentChatMessages = await messages
        .find({
          chatId: new ObjectId(chatId),
        })
        .sort({ createdAt: 1 })
        .limit(100)
        .toArray();

      socket.send(
        JSON.stringify({
          type: "history",
          messages: existentChatMessages,
          lastFectedAt: new Date(),
        }),
      );

      const unsubscribe = messaging.subscribe(chatId, (message) => {
        socket.send(
          JSON.stringify({
            type: "message",
            message,
          }),
        );
      });

      socket.on("close", unsubscribe);
    },
  );
}
