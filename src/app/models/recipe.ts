import mongoose from "mongoose";
import { IUser } from "./user";

export interface IRecipe {
  _id: string;
  author: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  imageUrl: string;
  prepMinutes: number;
  calories: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecipePopulated extends Omit<IRecipe, "author"> {
  author: IUser;
}

export const recipeSchema = new mongoose.Schema<IRecipe>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    prepMinutes: {
      type: Number,
    },
    calories: {
      type: Number,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
