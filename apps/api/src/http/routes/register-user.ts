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
        tags: ["Users"],
        summary: "Register a new user",
        description: "Creates a new user account with a unique e-mail address.",
        body: z.object({
          name: z.string().nonempty(),
          email: z.email(),
          password: z.string().min(8),
        }),
        response: {
          204: z.void().describe("User created successfully."),
          409: z
            .object({ message: z.string() })
            .describe("A user with the same e-mail already exists."),
        },
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

      return reply.status(204).send();
    },
  );
}
