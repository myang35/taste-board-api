import { dbUtils } from "@src/utils/db-utils";
import { Recipe } from "../models/recipe";
import { UserDto } from "./user-dto";

export class RecipeDto {
  id: string;
  author: UserDto;
  name: string;
  servings?: number;
  description: string;
  prepMinutes?: number;
  cookMinutes?: number;
  difficulty?: number;
  imageUrl: string;
  tags: string[];
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    notes: string;
  }[];
  instructions: {
    description: string;
    minutes?: number;
  }[];
  calories?: number;
  proteinGrams?: number;
  carbohydratesGrams?: number;
  fatGrams?: number;
  fiberGrams?: number;
  sugarGrams?: number;
  notes: string;
  shared: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;

  constructor(params: {
    id: string;
    author: UserDto;
    name: string;
    servings?: number;
    description: string;
    prepMinutes?: number;
    cookMinutes?: number;
    difficulty?: number;
    imageUrl: string;
    tags: string[];
    ingredients: {
      name: string;
      amount: number;
      unit: string;
      notes: string;
    }[];
    instructions: {
      description: string;
      minutes?: number;
    }[];
    calories?: number;
    proteinGrams?: number;
    carbohydratesGrams?: number;
    fatGrams?: number;
    fiberGrams?: number;
    sugarGrams?: number;
    notes: string;
    shared: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = params.id;
    this.author = params.author;
    this.name = params.name;
    this.servings = params.servings;
    this.description = params.description;
    this.prepMinutes = params.prepMinutes;
    this.cookMinutes = params.cookMinutes;
    this.difficulty = params.difficulty;
    this.imageUrl = params.imageUrl;
    this.tags = params.tags;
    this.ingredients = params.ingredients;
    this.instructions = params.instructions;
    this.calories = params.calories;
    this.proteinGrams = params.proteinGrams;
    this.carbohydratesGrams = params.carbohydratesGrams;
    this.fatGrams = params.fatGrams;
    this.fiberGrams = params.fiberGrams;
    this.sugarGrams = params.sugarGrams;
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
      author: UserDto.fromDoc(recipeDoc.author),
      name: recipeDoc.name,
      servings: recipeDoc.servings,
      description: recipeDoc.description ?? "",
      prepMinutes: recipeDoc.prepMinutes,
      cookMinutes: recipeDoc.cookMinutes,
      difficulty: recipeDoc.difficulty,
      imageUrl: recipeDoc.imageUrl ?? "",
      tags: recipeDoc.tags ?? [],
      ingredients:
        recipeDoc.ingredients?.map((ingredient) => ({
          name: ingredient.name ?? "",
          amount: ingredient.amount,
          unit: ingredient.unit,
          notes: ingredient.notes ?? "",
        })) ?? [],
      instructions: recipeDoc.instructions ?? [],
      calories: recipeDoc.calories,
      proteinGrams: recipeDoc.proteinGrams,
      carbohydratesGrams: recipeDoc.carbohydratesGrams,
      fatGrams: recipeDoc.fatGrams,
      fiberGrams: recipeDoc.fiberGrams,
      sugarGrams: recipeDoc.sugarGrams,
      notes: recipeDoc.notes ?? "",
      shared: recipeDoc.shared ?? false,
      viewCount: recipeDoc.views?.length ?? 0,
      createdAt: recipeDoc.createdAt?.toISOString() ?? "",
      updatedAt: recipeDoc.updatedAt?.toISOString() ?? "",
    });
  }
}
