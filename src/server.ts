import "dotenv/config";
import { app } from "./app";
import { config } from "./config";
import { dbConnect } from "./db";

dbConnect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(config.port, (error) => {
  if (!error) {
    console.log(`App is running on http://localhost:${config.port}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
