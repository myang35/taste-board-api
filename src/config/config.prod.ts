export const prodConfig = {
  corsOrigin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:4200"],
  port: process.env.PORT || "3000",
};
