import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { ingredientsRouter } from "./routes/ingredients";
import { recipesRouter } from "./routes/recipes";

export const app = express();

app.use(express.json());

app.use(authRouter);
app.use(ingredientsRouter);
app.use(recipesRouter);

app.use(errorHandler);
