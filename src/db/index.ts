import mongoose from "mongoose";
import { config } from "../config";

export async function dbConnect() {
  return mongoose.connect(config.dbConnectionString);
}
