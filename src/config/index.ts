import { devConfig } from "./config.dev";
import { prodConfig } from "./config.prod";
import { requireVar } from "./utils/require-var";

export const config = {
  jwtSecret: requireVar("JWT_SECRET"),
  mongoUsername: requireVar("MONGO_USERNAME"),
  mongoPassword: requireVar("MONGO_PASSWORD"),
  ...(process.env.NODE_ENV === "production" ? prodConfig : devConfig),
};
