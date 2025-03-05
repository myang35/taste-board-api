import { IRecipePopulated } from "@src/app/models/recipe";
import mongoose from "mongoose";
import { UserDto } from "./user-dto";

export class RecipeDto {
  id: string;
  name: string;
  author: mongoose.Schema.Types.ObjectId | UserDto;
  createdAt: string;
  updatedAt: string;

  constructor(params: {
    id: string;
    name: string;
    author: UserDto;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.author = params.author;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  static fromDoc(recipeDoc: IRecipePopulated) {
    return new RecipeDto({
      id: recipeDoc._id,
      name: recipeDoc.name,
      author: new UserDto({
        id: recipeDoc.author._id,
        email: recipeDoc.author.email,
      }),
      createdAt: recipeDoc.createdAt.toISOString(),
      updatedAt: recipeDoc.updatedAt.toISOString(),
    });
  }
}
