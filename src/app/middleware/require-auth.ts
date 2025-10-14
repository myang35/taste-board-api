import { UnauthenticatedError } from "@src/app/errors/unauthenticated-error";
import { RequestHandler } from "express";
import { requestHandler } from "../wrappers/request-handler";

export const requireAuth: RequestHandler = requestHandler((req, res, next) => {
  if (!res.locals.user) {
    res.status(401).json(new UnauthenticatedError());
    return;
  }

  next();
});
