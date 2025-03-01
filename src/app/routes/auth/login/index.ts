import { UserDto } from "@src/app/dto/user-dto";
import { InvalidCredentialsError } from "@src/app/errors/invalid-credentials-error";
import {
  InvalidInputsError,
  InvalidInputsErrorInput,
} from "@src/app/errors/invalid-inputs-error";
import { userService } from "@src/app/services/user-service";
import { requestHandler } from "@src/app/wrappers/request-handler";
import express from "express";

const PATH = "/login";

export const loginRouter = express.Router().post(
  PATH,
  requestHandler(async (req, res) => {
    const { email, password } = req.body;

    const error = validateInputs(req.body);
    if (error) {
      res.status(400).json(error);
      return;
    }
    const userDoc = await userService.getByEmail(email);
    if (!userDoc) {
      res.status(404).json(new InvalidCredentialsError());
      return;
    }

    const passwordIsValid = await userService.verifyPassword(userDoc, password);
    if (!passwordIsValid) {
      res.status(404).json(new InvalidCredentialsError());
      return;
    }

    const userDto = UserDto.fromDoc(userDoc);
    const token = await userService.createAuthToken(userDoc);

    res.json({ user: userDto, token });
  })
);

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
