import type { ObjectId } from "mongodb";

export type User = {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
};
