import { dbUtils } from "@src/utils/db-utils";
import { Recipe } from "../models/recipe";
import { UserDto } from "./user-dto";

export class RecipeDto {
  id: string;
  author: UserDto;
  name: string;
  description: string;
  imageUrl: string;
  prepMinutes?: number;
  calories?: number;
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
    prepMinutes?: number;
    calories?: number;
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

  static fromDoc(recipeDoc: Recipe) {
    if (!dbUtils.isPopulated(recipeDoc.author)) {
      throw new Error("Author is not populated");
    }
    return new RecipeDto({
      id: recipeDoc._id.toString(),
      author: new UserDto({
        id: recipeDoc.author._id.toString(),
        email: recipeDoc.author.email,
        name: recipeDoc.author.name ?? "",
        imageUrl: recipeDoc.author.imageUrl ?? "",
      }),
      name: recipeDoc.name,
      description: recipeDoc.description ?? "",
      imageUrl: recipeDoc.imageUrl ?? "",
      prepMinutes: recipeDoc.prepMinutes,
      calories: recipeDoc.calories,
      tags: recipeDoc.tags ?? [],
      ingredients:
        recipeDoc.ingredients?.map((ingredient) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })) ?? [],
      steps: recipeDoc.steps,
      notes: recipeDoc.notes ?? "",
      shared: recipeDoc.shared,
      viewCount: recipeDoc.views?.length ?? 0,
      createdAt: recipeDoc.createdAt?.toISOString() ?? "",
      updatedAt: recipeDoc.updatedAt?.toISOString() ?? "",
    });
  }
}
