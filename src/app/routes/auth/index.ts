import express from "express";
import { loginRouter } from "./login";
import { signupRouter } from "./signup";

export const authRouter = express.Router();

authRouter.use(loginRouter, signupRouter);
