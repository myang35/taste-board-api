import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserDto } from "../../../dto/user-dto";
import {
  InvalidInputsError,
  InvalidInputsErrorInput,
} from "../../../errors/invalid-inputs-error";
import { userService } from "../../../services/user-service";

export const signupRoute: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const error = validateInputs(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const userDoc = await userService.create({
      email,
      password: hashPassword,
    });
    const userDto = UserDto.fromDoc(userDoc);

    const token = jwt.sign({ user: userDto }, "privatekey", {
      expiresIn: "2h",
    });

    res.json({ user: userDto, token });
  } catch (error) {
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

function validateInputs(inputs: any) {
  const inputErrors: InvalidInputsErrorInput[] = [];

  if (!inputs.email) {
    inputErrors.push({
      name: "email",
      message: "Required",
    });
  }

  if (!inputs.password) {
    inputErrors.push({
      name: "password",
      message: "Required",
    });
  }

  if (inputErrors.length > 0) {
    return new InvalidInputsError({ inputs: inputErrors });
  }

  return null;
}
