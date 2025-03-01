import { HydratedDocument } from "mongoose";
import type { IUser } from "../models/user";

export class UserDto {
  id: string;
  email: string;

  constructor(params: { id: string; email: string }) {
    this.id = params.id;
    this.email = params.email;
  }

  static fromDoc(userDoc: HydratedDocument<IUser>) {
    return new UserDto({
      id: userDoc.id,
      email: userDoc.email,
    });
  }
}
