import { config } from "@src/config";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { requestHandler } from "../wrappers/request-handler";

export const getAuth: RequestHandler = requestHandler((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer") {
    return next();
  }
  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload === "string" || !payload.user) {
      return next();
    }

    res.locals = { user: payload.user };
  } catch (error) {
    return next();
  }

  next();
});
