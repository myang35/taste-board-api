export const prodConfig = {
  corsOrigin: process.env.CORS_ORIGIN?.split(",") || ["https://morecipes.com"],
  port: process.env.PORT || "3000",
};
