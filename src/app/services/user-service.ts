import { IUser, User } from "@src/app/models/user";
import { config } from "@src/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { UserDto } from "../dto/user-dto";

export const userService = {
  getById: async (id: string) => {
    return User.findById(id);
  },
  getByEmail: async (email: string) => {
    return User.findOne({ email });
  },
  create: async (user: IUser) => {
    const hashPassword = await bcrypt.hash(user.password, 10);
    return User.create({
      email: user.email,
      password: hashPassword,
    });
  },
  createAuthToken: async (userDoc: HydratedDocument<IUser>) => {
    const payload = { user: UserDto.fromDoc(userDoc) };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "2h",
    });
    return token;
  },
  verifyPassword: async (
    userDoc: HydratedDocument<IUser>,
    password: string
  ) => {
    return bcrypt.compare(password, userDoc.password);
  },
};
