import { UserDto } from "@src/app/dto/user-dto";
import { RefreshToken } from "@src/app/models/refresh-token";
import { IUser, User } from "@src/app/models/user";
import { config } from "@src/config";
import { dateUtils } from "@src/utils/date-utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userService = {
  getAll: async () => {
    return User.find().lean();
  },
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
  updateById: async (
    id: string,
    updatedUser: {
      name?: string;
      imgUrl?: string;
    }
  ) => {
    return User.findByIdAndUpdate(id, updatedUser, { new: true }).lean();
  },
  deleteById: async (id: string) => {
    return User.findByIdAndDelete(id);
  },
  verifyPassword: async (userDoc: IUser, password: string) => {
    return bcrypt.compare(password, userDoc.password);
  },
  getByRefreshToken: async (refreshToken: string) => {
    const refreshTokenDoc = await RefreshToken.findOne({ value: refreshToken });
    if (!refreshTokenDoc) {
      return null;
    }
    return User.findById(refreshTokenDoc.user);
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
  deleteRefreshToken: async (refreshToken: string) => {
    return RefreshToken.deleteOne({ value: refreshToken });
  },
};
