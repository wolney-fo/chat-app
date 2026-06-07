import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { users } from "../../database/mongo-client";
import { ObjectId } from "mongodb";

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/me", { onRequest: [verifyJWT] }, async (request, reply) => {
      const user = await users.findOne({
        _id: new ObjectId(request.user.sub),
      });

      if (!user) {
        return reply.status(400).send({ message: "User not found" });
      }

      delete user.passwordHash;

      return reply.status(200).send(user);
    });
}
