import { UserDto } from "@src/app/dto/user-dto";
import { RefreshToken } from "@src/app/models/refresh-token";
import { IUser, User } from "@src/app/models/user";
import { config } from "@src/config";
import { dateUtils } from "@src/utils/date-utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userService = {
  getById: async (id: string) => {
    return User.findById(id).lean();
  },
  getByEmail: async (email: string) => {
    return User.findOne({ email }).lean();
  },
  getByRefreshToken: async (refreshToken: string) => {
    const refreshTokenDoc = await RefreshToken.findOne({ value: refreshToken });
    if (!refreshTokenDoc) {
      return null;
    }
    return User.findById(refreshTokenDoc.user);
  },
  create: async (user: { email: string; password: string }) => {
    const hashPassword = await bcrypt.hash(user.password, 10);
    return User.create({
      email: user.email,
      password: hashPassword,
    });
  },
  createRefreshToken: async (userId: string) => {
    return RefreshToken.create({
      value: crypto.randomUUID(),
      user: userId,
      expireAt: dateUtils.createDateAfter(1000 * 60 * 60 * 2),
    });
  },
  createAccessToken: async (userDoc: IUser) => {
    const payload = { user: UserDto.fromDoc(userDoc) };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "15m",
    });
    return token;
  },
  verifyPassword: async (userDoc: IUser, password: string) => {
    return bcrypt.compare(password, userDoc.password);
  },
};
