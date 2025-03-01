import type { IUser } from "@src/app/models/user";
import { HydratedDocument } from "mongoose";

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
