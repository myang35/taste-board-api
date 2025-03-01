import { config } from "@src/config";
import mongoose from "mongoose";

export async function dbConnect() {
  return mongoose.connect(
    `mongodb+srv://${config.mongoUsername}:${config.mongoPassword}@cluster0.owvuf.mongodb.net/${config.mongoDatabase}?retryWrites=true&w=majority&appName=Cluster0`
  );
}
