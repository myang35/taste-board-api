import { UserDto } from "@src/app/dto/user-dto";
import { RefreshTokenModel } from "@src/app/models/refresh-token";
import { User, UserModel } from "@src/app/models/user";
import { config } from "@src/config";
import { dateUtils } from "@src/utils/date-utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const userService = {
  getAll: async () => {
    return UserModel.find().lean();
  },
  getById: async (id: Types.ObjectId | string) => {
    return UserModel.findById(id).lean();
  },
  getByEmail: async (email: string) => {
    return UserModel.findOne({ email }).lean();
  },
  create: async (user: { email: string; password: string }) => {
    const hashPassword = await bcrypt.hash(user.password, 10);
    return UserModel.create({
      email: user.email,
      password: hashPassword,
    });
  },
  updateById: async (
    id: Types.ObjectId | string,
    user: {
      name?: string;
      imageUrl?: string;
    }
  ) => {
    return UserModel.findByIdAndUpdate(id, user, {
      new: true,
    }).lean();
  },
  deleteById: async (id: Types.ObjectId | string) => {
    return UserModel.findByIdAndDelete(id);
  },
  verifyPassword: async (userDoc: User, password: string) => {
    return bcrypt.compare(password, userDoc.password);
  },
  getByRefreshToken: async (refreshToken: string) => {
    const refreshTokenDoc = await RefreshTokenModel.findOne({
      value: refreshToken,
    });
    if (!refreshTokenDoc) {
      return null;
    }
    return UserModel.findById(refreshTokenDoc.user);
  },
  createRefreshToken: async (userId: Types.ObjectId) => {
    return RefreshTokenModel.create({
      value: crypto.randomUUID(),
      user: userId,
      expireAt: dateUtils.createDateAfter(1000 * 60 * 60 * 2),
    });
  },
  createAccessToken: async (userDoc: User) => {
    const payload = { user: UserDto.fromDoc(userDoc) };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "15m",
    });
    return token;
  },
  deleteRefreshToken: async (refreshToken: string) => {
    return RefreshTokenModel.deleteOne({ value: refreshToken });
  },
};
