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
        tags: ["Messages"],
        summary: "Subscribe to a chat's messages in real time",
        description:
          'Upgrades the connection to a WebSocket. On connect, the server sends the chat\'s message history as a single `{ type: "history", messages, lastFectedAt }` frame, then streams each new message as a `{ type: "message", message }` frame for as long as the connection stays open.',
        security: [{ cookieAuth: [] }],
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
