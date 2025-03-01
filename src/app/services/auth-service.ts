import { UserDto } from "@src/app/dto/user-dto";
import { IUser } from "@src/app/models/user";
import { config } from "@src/config";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";

export const authService = {
  /**
   * Generates JWT for the user
   * @param userDoc
   * @returns JWT
   */
  login: async (userDoc: HydratedDocument<IUser>) => {
    const payload = { user: UserDto.fromDoc(userDoc) };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "2h",
    });
    return token;
  },
};
