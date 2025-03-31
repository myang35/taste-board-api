import { IRecipePopulated } from "@src/app/models/recipe";
import mongoose from "mongoose";
import { UserDto } from "./user-dto";

export class RecipeDto {
  id: string;
  author: mongoose.Schema.Types.ObjectId | UserDto;
  name: string;
  description: string;
  imageUrl: string;
  prepMinutes: number;
  calories: number;
  tags: string[];
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  steps: string[];
  notes: string;
  shared: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;

  constructor(params: {
    id: string;
    author: UserDto;
    name: string;
    description: string;
    imageUrl: string;
    prepMinutes: number;
    calories: number;
    tags: string[];
    ingredients: {
      id: string;
      name: string;
      amount: number;
      unit: string;
    }[];
    steps: string[];
    notes: string;
    shared: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = params.id;
    this.author = params.author;
    this.name = params.name;
    this.description = params.description;
    this.imageUrl = params.imageUrl;
    this.prepMinutes = params.prepMinutes;
    this.calories = params.calories;
    this.tags = params.tags;
    this.ingredients = params.ingredients;
    this.steps = params.steps;
    this.notes = params.notes;
    this.shared = params.shared;
    this.viewCount = params.viewCount;
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
      prepMinutes: recipeDoc.prepMinutes,
      calories: recipeDoc.calories,
      tags: recipeDoc.tags,
      ingredients: recipeDoc.ingredients.map((ingredient) => ({
        id: ingredient._id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
      steps: recipeDoc.steps,
      notes: recipeDoc.notes,
      shared: recipeDoc.shared,
      viewCount: recipeDoc.views.length,
      createdAt: recipeDoc.createdAt.toISOString(),
      updatedAt: recipeDoc.updatedAt.toISOString(),
    });
  }
}
