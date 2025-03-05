import mongoose from "mongoose";
import { IUser } from "./user";

export interface IRecipe {
  _id: string;
  name: string;
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecipePopulated extends Omit<IRecipe, "author"> {
  author: IUser;
}

export const recipeSchema = new mongoose.Schema<IRecipe>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
