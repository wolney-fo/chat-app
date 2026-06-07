import type { ObjectId } from "mongodb";

export type Message = {
  _id?: ObjectId;
  chatId: ObjectId;
  senderId: ObjectId;
  content: string;
  createdAt: Date;
};
