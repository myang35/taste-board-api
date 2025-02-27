import type { RequestHandler } from "express";

export const loginRoute: RequestHandler = (req, res) => {
  res.json({ success: true });
};
