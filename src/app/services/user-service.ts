import { IUser, User } from "../models/user";

export const userService = {
  getById: async (id: string) => {
    return User.findById(id);
  },
  create: async (user: IUser) => {
    return User.create(user);
  },
};
