import { devConfig } from "./config.dev";
import { prodConfig } from "./config.prod";
import { requireVar } from "./utils/require-var";

export const config = {
  jwtSecret: requireVar("JWT_SECRET"),
  mongodbUri: requireVar("MONGODB_URI"),
  ...(process.env.NODE_ENV === "production" ? prodConfig : devConfig),
};
