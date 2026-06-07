import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { chats, messages } from "../../database/mongo-client";
import { ObjectId } from "mongodb";

export async function sendMessage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/chats/:chatId/messages",
    {
      onRequest: [verifyJWT],
      schema: {
        params: z.object({
          chatId: z.string(),
        }),
        body: z.object({
          content: z.string().nonempty(),
        }),
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

      const result = await messages.insertOne({
        chatId: new ObjectId(chatId),
        senderId: new ObjectId(sub),
        content,
        createdAt: new Date(),
      });

      return reply.status(201).send({
        message: {
          _id: result.insertedId,
        },
      });
    },
  );
}
