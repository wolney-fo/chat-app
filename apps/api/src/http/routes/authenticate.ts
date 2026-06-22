import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { compare } from "bcryptjs";
import { users } from "../../database/mongo-client";
import { env } from "../../env";

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate with e-mail and password",
        description:
          "Validates the user's credentials and starts a new session.",
        body: z.object({
          email: z.email(),
          password: z.string().min(8),
        }),
        response: {
          204: z
            .void()
            .describe(
              "Authenticated successfully. Session cookie has been set.",
            ),
          401: z
            .object({ message: z.string() })
            .describe("Invalid e-mail or password."),
        },
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

      const refreshToken = await reply.jwtSign(
        { sub: user._id },
        { expiresIn: "7d" },
      );

      return reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: env.NODE_ENV === "production",
          sameSite: true,
          httpOnly: true,
        })
        .status(204)
        .send();
    },
  );
}
