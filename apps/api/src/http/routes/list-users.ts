import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { users } from "../../database/mongo-client";

export async function listUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users",
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ["Users"],
        summary: "List registered users",
        description:
          "Returns every registered user's id and name.",
        security: [{ cookieAuth: [] }],
        response: {
          200: z.object({
            users: z.array(
              z.object({
                _id: z.string(),
                name: z.string(),
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
      const registeredUsers = await users.find().toArray();

      const listedUsers = registeredUsers.map((user) => {
        return {
          _id: user._id.toString(),
          name: user.name,
        };
      });

      return reply.status(200).send({
        users: listedUsers,
      });
    });
}
