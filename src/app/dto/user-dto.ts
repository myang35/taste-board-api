import type { IUser } from "@src/app/models/user";

export class UserDto {
  id: string;
  email: string;
  name: string;
  imgUrl: string;

  constructor(params: {
    id: string;
    email: string;
    name: string;
    imgUrl: string;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.name = params.name;
    this.imgUrl = params.imgUrl;
  }

  static fromDoc(userDoc: IUser) {
    return new UserDto({
      id: userDoc._id,
      email: userDoc.email,
      name: userDoc.name ?? "",
      imgUrl: userDoc.imgUrl ?? "",
    });
  }
}
