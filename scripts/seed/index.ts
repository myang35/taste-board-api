import "dotenv/config";
import "module-alias/register";

import { Ingredient } from "@src/app/models/ingredient";
import { config } from "@src/config";
import mongoose from "mongoose";
import { ingredients } from "./ingredients";

mongoose.connect(config.mongodbUri).then(async (connection) => {
  await Ingredient.create(ingredients);
  console.log(`\x1b[32mCreated ${ingredients.length} ingredients\x1b[0m`);

  connection.disconnect();
});
