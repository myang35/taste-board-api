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
  ingredients: {
    _id: string;
    name: string;
    amount: number;
    unit: string;
  }[];
  steps: string[];
  notes: string;
  shared: boolean;
  views: {
    _id: string;
    viewer: mongoose.Schema.Types.ObjectId;
    date: Date;
  }[];
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
      required: true,
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
    ingredients: {
      type: [
        {
          name: String,
          amount: Number,
          unit: String,
        },
      ],
      required: true,
    },
    steps: {
      type: [String],
      required: true,
    },
    notes: {
      type: String,
    },
    shared: {
      type: Boolean,
      required: true,
    },
    views: {
      type: [
        {
          viewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
