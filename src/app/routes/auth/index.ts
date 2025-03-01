import express from "express";
import { loginRouter } from "./login";
import { signupRouter } from "./signup";

const PATH = "/auth";

export const authRouter = express.Router().use(PATH, loginRouter, signupRouter);
