import { UserDto } from "@src/app/dto/user-dto";
import { InvalidCredentialsError } from "@src/app/errors/invalid-credentials-error";
import {
  InvalidInputsError,
  InvalidInputsErrorInput,
} from "@src/app/errors/invalid-inputs-error";
import { UnauthenticatedError } from "@src/app/errors/unauthenticated-error";
import { userService } from "@src/app/services/user-service";
import { requestHandler } from "@src/app/wrappers/request-handler";
import express from "express";

export const authRouter = express.Router();

authRouter
  .post(
    "/login",
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

      const passwordIsValid = await userService.verifyPassword(
        userDoc,
        password
      );
      if (!passwordIsValid) {
        res.status(404).json(new InvalidCredentialsError());
        return;
      }

      const [refreshToken, accessToken] = await Promise.all([
        userService.createRefreshToken(userDoc._id),
        userService.createAccessToken(userDoc),
      ]);
      const userDto = UserDto.fromDoc(userDoc);

      res.cookie("refreshToken", refreshToken.value, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: refreshToken.expireAt,
      });
      res.json({ user: userDto, token: accessToken });

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
    })
  )
  .post(
    "/signup",
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
      const [refreshToken, accessToken] = await Promise.all([
        userService.createRefreshToken(userDoc._id),
        userService.createAccessToken(userDoc),
      ]);
      const userDto = UserDto.fromDoc(userDoc);

      res.cookie("refreshToken", refreshToken.value, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: refreshToken.expireAt,
      });
      res.json({ user: userDto, token: accessToken });

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
    })
  )
  .post(
    "/refresh",
    requestHandler(async (req, res) => {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        res.status(401).json(
          new UnauthenticatedError({
            message: "Refresh token is missing",
          })
        );
        return;
      }

      if (typeof refreshToken !== "string") {
        res.status(401).json(
          new UnauthenticatedError({
            message: "Refresh token is invalid",
          })
        );
        return;
      }

      const userDoc = await userService.getByRefreshToken(refreshToken);
      if (!userDoc) {
        res.status(404).json(
          new UnauthenticatedError({
            message: "Refresh token or user is not found",
          })
        );
        return;
      }

      const accessToken = await userService.createAccessToken(userDoc);
      const userDto = UserDto.fromDoc(userDoc);
      res.json({ user: userDto, token: accessToken });
    })
  );
