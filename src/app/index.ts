import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";

export const app = express().use(express.json(), authRouter, errorHandler);
