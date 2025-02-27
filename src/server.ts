import { app } from "./app";

const port = process.env.PORT || "3000";

app.listen(port, (error) => {
  if (!error) {
    console.log(`App is running on http://localhost:${port}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
