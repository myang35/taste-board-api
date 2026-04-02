import { UserDto } from "../../dto/user-dto";
import { InvalidCredentialsError } from "../../errors/invalid-credentials-error";
import { InvalidInputsError } from "../../errors/invalid-inputs-error";
import { UnauthenticatedError } from "../../errors/unauthenticated-error";
import { userService } from "../../services/user-service";
import { requestHandler } from "../../wrappers/request-handler";
import express from "express";

export const authRouter = express.Router();

authRouter
  .post(
    "/login",
    requestHandler(async (req, res) => {
      const { username, password } = req.body;

      const invalidInputsError = new InvalidInputsError();

      if (!username) {
        invalidInputsError.addInputError("username", "Required");
      }

      if (!password) {
        invalidInputsError.addInputError("password", "Required");
      }

      if (invalidInputsError.hasInputErrors()) {
        res.status(400).json(invalidInputsError);
        return;
      }

      const userDoc = await userService.getByUsername(username);
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
        secure: req.secure,
        sameSite: "strict",
        expires: refreshToken.expireAt,
      });
      res.json({ user: userDto, token: accessToken });
    })
  )
  .post(
    "/signup",
    requestHandler(async (req, res) => {
      const { name, username, password } = req.body;

      const invalidInputsError = new InvalidInputsError();

      if (!name) {
        invalidInputsError.addInputError("name", "Required");
      }

      if (username) {
        const existingUserDoc = await userService.getByUsername(username);
        if (existingUserDoc) {
          invalidInputsError.addInputError(
            "username",
            "Username is already in use"
          );
        }
      } else {
        invalidInputsError.addInputError("username", "Required");
      }

      if (!password) {
        invalidInputsError.addInputError("password", "Required");
      }

      if (invalidInputsError.hasInputErrors()) {
        res.status(400).json(invalidInputsError);
      }

      const userDoc = await userService.create({
        name,
        username,
        password,
      });
      const [refreshToken, accessToken] = await Promise.all([
        userService.createRefreshToken(userDoc._id),
        userService.createAccessToken(userDoc),
      ]);
      const userDto = UserDto.fromDoc(userDoc);

      res.cookie("refreshToken", refreshToken.value, {
        httpOnly: true,
        secure: req.secure,
        sameSite: "strict",
        expires: refreshToken.expireAt,
      });
      res.json({ user: userDto, token: accessToken });
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
  )
  .post(
    "/logout",
    requestHandler(async (req, res) => {
      const { refreshToken } = req.cookies;
      await userService.deleteRefreshToken(refreshToken);
      res.clearCookie("refreshToken");
      res.status(204).send();
    })
  );
