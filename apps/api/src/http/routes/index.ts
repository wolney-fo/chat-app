import { FastifyInstance } from "fastify";
import { sendMessage } from "./send-message";
import { registerUser } from "./register-user";
import { authenticate } from "./authenticate";
import { getProfile } from "./get-profile";

export async function routes(app: FastifyInstance) {
  app.register(authenticate);
  app.register(getProfile);
  app.register(sendMessage);
  app.register(registerUser);
}
