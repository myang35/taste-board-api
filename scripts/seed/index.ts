import "dotenv/config";
import "module-alias/register";

import { IngredientModel } from "@src/app/models/ingredient";
import { RecipeModel } from "@src/app/models/recipe";
import { UserModel } from "@src/app/models/user";
import { config } from "@src/config";
import mongoose from "mongoose";
import { ingredients } from "./ingredients";
import { recipes } from "./recipes";
import { users } from "./users";

mongoose.connect(config.mongodbUri).then(async (connection) => {
  await Promise.all([
    createDocs(IngredientModel, "ingredient", ingredients),
    createDocs(UserModel, "user", users),
    createDocs(RecipeModel, "recipe", recipes),
  ]);

  connection.disconnect();
});

async function createDocs<T>(
  model: mongoose.Model<T>,
  dataName: string,
  docs: any
) {
  return model
    .insertMany(docs, { ordered: false })
    .then((result) => {
      console.log(`\x1b[32mCreated ${result.length} ${dataName}s\x1b[0m`);
    })
    .catch((error) => {
      if (error.insertedDocs) {
        console.log(
          `\x1b[32mCreated ${error.insertedDocs.length} ${dataName}s\x1b[0m`
        );
      } else {
        console.log(`\x1b[33mFailed to create ${dataName}s\x1b[0m`);
      }
    });
}
