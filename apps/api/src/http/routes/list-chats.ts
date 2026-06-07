import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { chats } from "../../database/mongo-client";
import { ObjectId } from "mongodb";

export async function listChats(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/chats", { onRequest: [verifyJWT] }, async (request, reply) => {
      const { sub } = request.user;

      const userChats = await chats
        .aggregate([
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

      return reply.status(200).send({ chats: userChats });
    });
}
