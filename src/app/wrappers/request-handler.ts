import { RequestHandler } from "express";

export function requestHandler<T>(
  handler: RequestHandler<T>
): RequestHandler<T> {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
