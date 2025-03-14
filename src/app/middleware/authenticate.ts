import { UnauthenticatedError } from "@src/app/errors/unauthenticated-error";
import { config } from "@src/config";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { requestHandler } from "../wrappers/request-handler";

export const authenticate: RequestHandler = requestHandler((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res
      .status(401)
      .json(
        new UnauthenticatedError({ message: "Authorization header is missing" })
      );
    return;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer") {
    res
      .status(401)
      .json(
        new UnauthenticatedError({ message: "Invalid authentication scheme" })
      );
    return;
  }
  if (!token) {
    res
      .status(401)
      .json(new UnauthenticatedError({ message: "Access token is missing" }));
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload === "string" || !payload.user) {
      res
        .status(401)
        .json(
          new UnauthenticatedError({ message: "Jwt payload is missing user" })
        );
      return;
    }

    res.locals = { user: payload.user };
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError ||
      error instanceof jwt.TokenExpiredError
    ) {
      res
        .status(401)
        .json(new UnauthenticatedError({ message: error.message }));
      return;
    }
    throw error;
  }

  next();
});
