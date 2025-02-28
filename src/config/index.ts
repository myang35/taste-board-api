import { devConfig } from "./config.dev";
import { prodConfig } from "./config.prod";
import { requireVar } from "./utils/require-var";

export const config = {
  dbConnectionString: requireVar("DB_CONNECTION_STRING"),
  jwtSecret: requireVar("JWT_SECRET"),
  ...(process.env.NODE_ENV === "production" ? prodConfig : devConfig),
};
