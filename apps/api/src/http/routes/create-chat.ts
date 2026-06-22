import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { z } from "zod";
import { chats } from "../../database/mongo-client";
import { ObjectId } from "mongodb";
import { chatEvents } from "../../utils/messaging-pub-sub";

export async function createChat(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/chats",
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ["Chats"],
        summary: "Create a new chat",
        description:
          "Creates a new chat with the given name and members. The authenticated user is automatically added as a member.",
        security: [{ cookieAuth: [] }],
        body: z.object({
          name: z.string().min(2),
          membersIds: z.array(z.string()),
        }),
        response: {
          201: z.object({
            chat: z.object({
              acknowledged: z.boolean(),
              insertedId: z.string(),
            }),
          }),
          401: z
            .object({ message: z.string() })
            .describe("Missing or invalid session."),
        },
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

      for (const memberId of membersIds) {
        chatEvents.publish(memberId, {
          _id: result.insertedId.toString(),
          name,
          lastMessage: null,
        });
      }

      return reply.status(201).send({
        chat: {
          acknowledged: result.acknowledged,
          insertedId: result.insertedId.toString(),
        },
      });
    },
  );
}
