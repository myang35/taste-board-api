import express from "express";
import { authRouter } from "./routes/auth";

export const app = express().use(express.json(), authRouter);
