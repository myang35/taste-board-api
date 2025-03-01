import express from "express";

const PATH = "/login";

export const loginRouter = express.Router().post(PATH, (req, res) => {
  res.json({ success: true });
});
