import { config } from "../config";
import mongoose from "mongoose";

export async function dbConnect() {
  return mongoose.connect(config.mongodbUri);
}
