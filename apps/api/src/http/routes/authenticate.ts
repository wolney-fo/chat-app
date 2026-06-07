import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { compare } from "bcryptjs";
import { users } from "../../database/mongo-client";

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions",
    {
      schema: {
        body: z.object({
          email: z.email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await users.findOne({ email });

      if (!user) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }

      const doesPasswordMatch = await compare(password, user.passwordHash);

      if (!doesPasswordMatch) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }

      const token = await reply.jwtSign({
        sub: user._id,
      });

      const refreshToken = await reply.jwtSign({
        sub: user._id,
        expiresIn: "7d",
      });

      return reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(204)
        .send();
    },
  );
}
