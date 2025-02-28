import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserDto } from "../../../dto/user";
import { User } from "../../../models/user";

export const signupRoute: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: "INVALID_INPUTS_ERROR",
      message: "An email and password must be provided",
    });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const userDoc = new User({
      email,
      password: hashPassword,
    });
    await userDoc.save();
    const userDto = UserDto.fromDoc(userDoc);

    const token = jwt.sign({ user: userDto }, "privatekey", {
      expiresIn: "2h",
    });

    res.json({ user: userDto, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "DB_ERROR",
      message: (() => {
        if (error instanceof Error) return error.message;
        if (typeof error === "string") return error;
        return "Failed to create user";
      })(),
    });
  }
};
