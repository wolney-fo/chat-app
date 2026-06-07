import { FastifyInstance } from "fastify";
import { sendMessage } from "./send-message";
import { registerUser } from "./register-user";
import { authenticate } from "./authenticate";
import { getProfile } from "./get-profile";
import { createChat } from "./create-chat";
import { listChats } from "./list-chats";
import { listUsers } from "./list-users";

export async function routes(app: FastifyInstance) {
  app.register(authenticate);
  app.register(createChat);
  app.register(getProfile);
  app.register(listChats);
  app.register(sendMessage);
  app.register(registerUser);
  app.register(listUsers);
}
