import { IUser, User } from "@src/app/models/user";
import { config } from "@src/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDto } from "../dto/user-dto";

export const userService = {
  getById: async (id: string) => {
    return User.findById(id).lean();
  },
  getByEmail: async (email: string) => {
    return User.findOne({ email }).lean();
  },
  create: async (user: { email: string; password: string }) => {
    const hashPassword = await bcrypt.hash(user.password, 10);
    return User.create({
      email: user.email,
      password: hashPassword,
    });
  },
  createAuthToken: async (userDoc: IUser) => {
    const payload = { user: UserDto.fromDoc(userDoc) };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "2h",
    });
    return token;
  },
  verifyPassword: async (userDoc: IUser, password: string) => {
    return bcrypt.compare(password, userDoc.password);
  },
};
