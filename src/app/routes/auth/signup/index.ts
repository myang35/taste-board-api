import { UserDto } from "@src/app/dto/user-dto";
import {
  InvalidInputsError,
  InvalidInputsErrorInput,
} from "@src/app/errors/invalid-inputs-error";
import { userService } from "@src/app/services/user-service";
import express from "express";
import jwt from "jsonwebtoken";

const PATH = "/signup";

export const signupRouter = express.Router().post(PATH, async (req, res) => {
  const { email, password } = req.body;

  const error = validateInputs(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }

  try {
    const userDoc = await userService.create({
      email,
      password,
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
});

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
