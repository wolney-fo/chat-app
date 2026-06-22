import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middlewares/verify-jwt";
import { users } from "../../database/mongo-client";
import { ObjectId } from "mongodb";

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/me",
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ["Users"],
        summary: "Get the authenticated user's profile",
        description: "Returns the profile of the currently authenticated user.",
        security: [{ cookieAuth: [] }],
        response: {
          200: z.object({
            user: z.object({
              _id: z.string(),
              name: z.string(),
              email: z.email(),
            }),
          }),
          400: z.object({ message: z.string() }).describe("User not found."),
          401: z
            .object({ message: z.string() })
            .describe("Missing or invalid session."),
        },
      },
    },
    async (request, reply) => {
      const user = await users.findOne({
        _id: new ObjectId(request.user.sub),
      });

      if (!user) {
        return reply.status(400).send({ message: "User not found" });
      }

      return reply.status(200).send({
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      });
    });
}
