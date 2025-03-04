import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { ingredientsRouter } from "./routes/ingredients";

export const app = express().use(
  express.json(),
  authRouter,
  ingredientsRouter,
  errorHandler
);
