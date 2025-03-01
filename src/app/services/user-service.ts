import { IUser, User } from "@src/app/models/user";
import bcrypt from "bcrypt";

export const userService = {
  getById: async (id: string) => {
    return User.findById(id);
  },
  create: async (user: IUser) => {
    const hashPassword = await bcrypt.hash(user.password, 10);
    return User.create({
      email: user.email,
      password: hashPassword,
    });
  },
};
