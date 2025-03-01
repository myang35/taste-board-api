import { UserDto } from "@src/app/dto/user-dto";
import {
  InvalidInputsError,
  InvalidInputsErrorInput,
} from "@src/app/errors/invalid-inputs-error";
import { userService } from "@src/app/services/user-service";
import { requestHandler } from "@src/app/wrappers/request-handler";
import express from "express";

const PATH = "/signup";

export const signupRouter = express.Router().post(
  PATH,
  requestHandler(async (req, res) => {
    const { email, password } = req.body;

    const error = await validateInputs(req.body);
    if (error) {
      res.status(400).json(error);
      return;
    }

    const userDoc = await userService.create({
      email,
      password,
    });
    const userDto = UserDto.fromDoc(userDoc);
    const token = await userService.createAuthToken(userDoc);
    res.json({ user: userDto, token });
  })
);

async function validateInputs(inputs: any) {
  const inputErrors: InvalidInputsErrorInput[] = [];

  if (inputs.email) {
    const existingUserDoc = await userService.getByEmail(inputs.email);
    if (existingUserDoc) {
      inputErrors.push({
        name: "email",
        message: "This email is already taken",
      });
    }
  } else {
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
