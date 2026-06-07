import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { users } from "../../database/mongo-client";

export async function listUsers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/users", { onRequest: [verifyJWT] }, async (request, reply) => {
      const registeredUsers = await users.find().toArray();

      const listedUsers = registeredUsers.map((user) => {
        return {
          _id: user._id,
          name: user.name,
        };
      });

      return reply.status(200).send({
        users: listedUsers,
      });
    });
}
