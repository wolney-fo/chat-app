import { FastifyInstance } from "fastify";
import { sendMessage } from "./send-message";

export async function routes(app: FastifyInstance) {
  app.register(sendMessage);
}
