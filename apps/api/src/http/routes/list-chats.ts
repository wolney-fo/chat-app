import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { chats } from "../../database/mongo-client";
import { ObjectId } from "mongodb";
import { chatEvents } from "../../utils/messaging-pub-sub";

export async function listChats(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/chats",
    {
      websocket: true,
      onRequest: [verifyJWT],
      schema: {
        tags: ["Chats"],
        summary: "Subscribe to the authenticated user's chat list in real time",
        description:
          'Upgrades the connection to a WebSocket. On connect, the server sends the user\'s chats as a single `{ type: "history", chats, lastFectedAt }` frame, then streams each created or updated chat as a `{ type: "chat", chat }` frame for as long as the connection stays open.',
        security: [{ cookieAuth: [] }],
      },
    },
    async (socket, request) => {
      const { sub } = request.user;

      const userExistentChats = await chats
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

      socket.send(
        JSON.stringify({
          type: "history",
          chats: userExistentChats.map((chat) => ({
            _id: chat._id.toString(),
            name: chat.name,
            lastMessage: chat.lastMessage,
          })),
          lastFectedAt: new Date(),
        }),
      );

      const unsubscribe = chatEvents.subscribe(sub, (chat) => {
        socket.send(
          JSON.stringify({
            type: "chat",
            chat,
          }),
        );
      });

      socket.on("close", unsubscribe);
    },
  );
}
