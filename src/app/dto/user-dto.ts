import type { IUser } from "@src/app/models/user";

export class UserDto {
  id: string;
  email: string;

  constructor(params: { id: string; email: string }) {
    this.id = params.id;
    this.email = params.email;
  }

  static fromDoc(userDoc: IUser) {
    return new UserDto({
      id: userDoc._id,
      email: userDoc.email,
    });
  }
}
