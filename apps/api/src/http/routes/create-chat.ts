import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { z } from "zod";
import { chats } from "../../database/mongo-client";
import { ObjectId } from "mongodb";

export async function createChat(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/chats",
    {
      onRequest: [verifyJWT],
      schema: {
        body: z.object({
          name: z.string().min(2),
          membersIds: z.array(z.string()),
        }),
      },
    },
    async (request, reply) => {
      const { name, membersIds } = request.body;
      const { sub } = request.user;

      membersIds.push(sub);

      const result = await chats.insertOne({
        name,
        members: membersIds.map((memberId) => new ObjectId(memberId)),
      });

      return reply.status(201).send({
        chat: result,
      });
    },
  );
}
