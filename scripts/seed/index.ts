import "dotenv/config";
import "module-alias/register";

import { Ingredient } from "@src/app/models/ingredient";
import { Recipe } from "@src/app/models/recipe";
import { User } from "@src/app/models/user";
import { config } from "@src/config";
import mongoose from "mongoose";
import { ingredients } from "./ingredients";
import { recipes } from "./recipes";
import { users } from "./users";

mongoose.connect(config.mongodbUri).then(async (connection) => {
  await Promise.all([
    Ingredient.create(ingredients)
      .then(() => {
        console.log(`\x1b[32mCreated ${ingredients.length} ingredients\x1b[0m`);
      })
      .catch(() => {
        console.log(`\x1b[33mNo ingredients created\x1b[0m`);
      }),
    User.create(users)
      .then(() => {
        console.log(`\x1b[32mCreated ${users.length} users\x1b[0m`);
      })
      .catch(() => {
        console.log(`\x1b[33mNo users created\x1b[0m`);
      }),
    Recipe.create(recipes)
      .then(() => {
        console.log(`\x1b[32mCreated ${recipes.length} recipes\x1b[0m`);
      })
      .catch(() => {
        console.log(`\x1b[33mNo recipes created\x1b[0m`);
      }),
  ]);

  connection.disconnect();
});
