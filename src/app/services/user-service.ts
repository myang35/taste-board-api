import { UserDto } from "../dto/user-dto";
import { RefreshTokenModel } from "../models/refresh-token";
import { User, UserModel } from "../models/user";
import { config } from "../../config";
import { dateUtils } from "../../utils/date-utils";
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
  getByUsername: async (username: string) => {
    return UserModel.findOne({ username }).lean();
  },
  create: async (user: {
    name: string;
    username: string;
    password: string;
  }) => {
    const hashPassword = await bcrypt.hash(user.password, 10);
    return UserModel.create({
      name: user.name,
      username: user.username,
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
  updateUsernameById: async (id: Types.ObjectId | string, username: string) => {
    return UserModel.findByIdAndUpdate(id, { username }, { new: true }).lean();
  },
  updatePasswordById: async (id: Types.ObjectId | string, password: string) => {
    const hashPassword = await bcrypt.hash(password, 10);
    return UserModel.findByIdAndUpdate(
      id,
      { password: hashPassword },
      { new: true }
    ).lean();
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
