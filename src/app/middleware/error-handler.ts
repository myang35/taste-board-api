import { InternalServerError } from "../errors/internal-server-error";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(500).json(new InternalServerError({ error }));
};
