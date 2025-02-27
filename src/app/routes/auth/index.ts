import express from "express";
import { loginRoute } from "./login";
import { signupRoute } from "./signup";

export const authRouter = express.Router();

authRouter.post("/login", loginRoute);
authRouter.post("/signup", signupRoute);
