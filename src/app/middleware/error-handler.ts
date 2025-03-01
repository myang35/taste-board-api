import { InternalServerError } from "@src/app/errors/internal-server-error";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(500).json(new InternalServerError({ error }));
};
