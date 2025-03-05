import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { ingredientsRouter } from "./routes/ingredients";
import { recipesRouter } from "./routes/recipes";

export const app = express().use(
  express.json(),
  authRouter,
  ingredientsRouter,
  recipesRouter,
  errorHandler
);
