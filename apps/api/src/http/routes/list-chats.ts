import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { chats } from "../../database/mongo-client";
import { ObjectId } from "mongodb";

export async function listChats(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/chats",
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ["Chats"],
        summary: "List the authenticated user's chats",
        description:
          "Returns every chat the authenticated user is a member of, along with each chat's most recent message.",
        security: [{ cookieAuth: [] }],
        response: {
          200: z.object({
            chats: z.array(
              z.object({
                _id: z.string(),
                name: z.string(),
                lastMessage: z
                  .object({
                    content: z.string(),
                    createdAt: z.coerce.date(),
                  })
                  .nullable(),
              }),
            ),
          }),
          401: z
            .object({ message: z.string() })
            .describe("Missing or invalid session."),
        },
      },
    },
    async (request, reply) => {
      const { sub } = request.user;

      const userChats = await chats
        .aggregate<{
          _id: ObjectId;
          name: string;
          lastMessage: { content: string; createdAt: Date } | null;
        }>([
          {
            $match: { members: new ObjectId(sub) },
          },

          {
            $lookup: {
              from: "messages",
              let: { chatId: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
                { $sort: { createdAt: -1 } },
                { $limit: 1 },
                { $project: { content: 1, createdAt: 1, _id: 0 } },
              ],
              as: "lastMessage",
            },
          },

          {
            $project: {
              name: 1,
              lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
            },
          },
        ])
        .toArray();

      return reply.status(200).send({
        chats: userChats.map((chat) => ({
          _id: chat._id.toString(),
          name: chat.name,
          lastMessage: chat.lastMessage,
        })),
      });
    });
}
