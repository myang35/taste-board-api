import { User } from "../models/user";

export class UserDto {
  id: string;
  username: string;
  name: string;
  imageUrl: string;

  constructor(params: {
    id: string;
    username: string;
    name: string;
    imageUrl: string;
  }) {
    this.id = params.id;
    this.username = params.username;
    this.name = params.name;
    this.imageUrl = params.imageUrl;
  }

  static fromDoc(userDoc: User) {
    return new UserDto({
      id: userDoc._id.toString(),
      username: userDoc.username,
      name: userDoc.name ?? "",
      imageUrl: userDoc.imageUrl ?? "",
    });
  }
}
