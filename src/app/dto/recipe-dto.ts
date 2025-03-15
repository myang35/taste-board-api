import { IRecipePopulated } from "@src/app/models/recipe";
import mongoose from "mongoose";
import { UserDto } from "./user-dto";

export class RecipeDto {
  id: string;
  author: mongoose.Schema.Types.ObjectId | UserDto;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;

  constructor(params: {
    id: string;
    author: UserDto;
    name: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = params.id;
    this.author = params.author;
    this.name = params.name;
    this.description = params.description;
    this.imageUrl = params.imageUrl;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  static fromDoc(recipeDoc: IRecipePopulated) {
    return new RecipeDto({
      id: recipeDoc._id,
      author: new UserDto({
        id: recipeDoc.author._id,
        email: recipeDoc.author.email,
      }),
      name: recipeDoc.name,
      description: recipeDoc.description,
      imageUrl: recipeDoc.imageUrl,
      createdAt: recipeDoc.createdAt.toISOString(),
      updatedAt: recipeDoc.updatedAt.toISOString(),
    });
  }
}
