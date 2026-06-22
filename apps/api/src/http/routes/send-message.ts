import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { chats, messages } from "../../database/mongo-client";
import { ObjectId } from "mongodb";
import { chatEvents, messaging } from "../../utils/messaging-pub-sub";

export async function sendMessage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/chats/:chatId/messages",
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ["Messages"],
        summary: "Send a message to a chat",
        description:
          "Persists a new message in the given chat and broadcasts it to subscribed real-time listeners.",
        security: [{ cookieAuth: [] }],
        params: z.object({
          chatId: z.string(),
        }),
        body: z.object({
          content: z.string().nonempty(),
        }),
        response: {
          201: z.object({
            message: z.object({
              _id: z.string(),
            }),
          }),
          400: z.object({ message: z.string() }).describe("Chat not found."),
          401: z
            .object({ message: z.string() })
            .describe("Missing or invalid session."),
        },
      },
    },
    async (request, reply) => {
      const { chatId } = request.params;
      const { content } = request.body;
      const { sub } = request.user;

      const chat = await chats.findOne({
        _id: new ObjectId(chatId),
      });

      if (!chat) {
        return reply.status(400).send({
          message: "Chat not found",
        });
      }

      const creationMoment = new Date();

      const result = await messages.insertOne({
        chatId: new ObjectId(chatId),
        senderId: new ObjectId(sub),
        content,
        createdAt: creationMoment,
      });

      messaging.publish(chatId, {
        _id: result.insertedId,
        chatId: new ObjectId(chatId),
        senderId: new ObjectId(sub),
        content,
        createdAt: creationMoment,
      });

      for (const memberId of chat.members) {
        chatEvents.publish(memberId.toString(), {
          _id: chatId,
          name: chat.name,
          lastMessage: { content, createdAt: creationMoment },
        });
      }

      return reply.status(201).send({
        message: {
          _id: result.insertedId.toString(),
        },
      });
    },
  );
}
