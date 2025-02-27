import type { RequestHandler } from "express";

export const signupRoute: RequestHandler = (req, res) => {
  res.json({ success: true });
};
