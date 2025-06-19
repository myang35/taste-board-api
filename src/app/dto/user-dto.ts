import { User } from "../models/user";

export class UserDto {
  id: string;
  email: string;
  name: string;
  imageUrl: string;

  constructor(params: {
    id: string;
    email: string;
    name: string;
    imageUrl: string;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.name = params.name;
    this.imageUrl = params.imageUrl;
  }

  static fromDoc(userDoc: User) {
    return new UserDto({
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name ?? "",
      imageUrl: userDoc.imageUrl ?? "",
    });
  }
}
