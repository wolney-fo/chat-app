import { FastifyInstance } from "fastify";
import { z } from "zod";
import { hash } from "bcryptjs";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { users } from "../../database/mongo-client";

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        body: z.object({
          name: z.string().nonempty(),
          email: z.email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const userWithSameEmail = await users.findOne({ email });

      if (userWithSameEmail) {
        return reply
          .status(409)
          .send({ message: "User with same e-mail already exists" });
      }

      const passwordHash = await hash(password, 6);

      const result = await users.insertOne({
        name,
        email,
        passwordHash,
      });

      return reply.status(201).send(result);
    },
  );
}
