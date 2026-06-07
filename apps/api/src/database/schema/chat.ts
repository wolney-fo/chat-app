import type { ObjectId } from "mongodb";

export type Chat = {
  _id?: ObjectId;
  name: string;
  members: ObjectId[];
};
