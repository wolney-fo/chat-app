import { MongoClient } from "mongodb";
import { env } from "../env";
import type { Message } from "./schema/message";
import type { Chat } from "./schema/chat";
import type { User } from "./schema/user";

const client = new MongoClient(env.MONGO_URL);
const db = client.db("chat-app");

export async function connectDB() {
  await client.connect();
}

export const messages = db.collection<Message>("messages");
export const users = db.collection<User>("users");
export const chats = db.collection<Chat>("chats");
