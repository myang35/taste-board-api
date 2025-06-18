import { config } from "@src/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { ingredientsRouter } from "./routes/ingredients";
import { recipesRouter } from "./routes/recipes";
import { usersRouter } from "./routes/users";

export const app = express();

app.use(express.json());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/recipes", recipesRouter);
app.use("/users", usersRouter);

app.use(errorHandler);
