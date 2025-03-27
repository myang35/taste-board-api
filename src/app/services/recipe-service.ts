import { Recipe } from "@src/app/models/recipe";
import { IUser } from "@src/app/models/user";

export const recipeService = {
  getAll: async () => {
    return Recipe.find().populate<{ author: IUser }>("author").lean();
  },
  get: async (id: string) => {
    return Recipe.findById(id).populate<{ author: IUser }>("author").lean();
  },
  create: async (recipe: {
    name: string;
    authorId: string;
    ingredients: {
      name: string;
      amount: number;
      unit: string;
    }[];
    steps: string[];
    shared: boolean;
    description?: string;
    imageUrl?: string;
    prepMinutes?: number;
    calories?: number;
    tags?: string[];
    notes?: string;
  }) => {
    const recipeDoc = await Recipe.create({
      name: recipe.name,
      author: recipe.authorId,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      shared: recipe.shared,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      prepMinutes: recipe.prepMinutes,
      calories: recipe.calories,
      tags: recipe.tags,
    });
    return recipeDoc;
  },
  delete: async (id: string) => {
    return Recipe.findByIdAndDelete(id)
      .populate<{ author: IUser }>("author")
      .lean();
  },
  update: async (
    id: string,
    recipe: {
      authorId?: string;
      name?: string;
      description?: string;
      imageUrl?: string;
      prepMinutes?: number;
      calories?: number;
      tags?: string[];
      ingredients?: {
        name: string;
        amount: number;
        unit: string;
      }[];
      steps?: string[];
      notes?: string;
      shared?: boolean;
    }
  ) => {
    return Recipe.findByIdAndUpdate(
      id,
      {
        author: recipe.authorId,
        name: recipe.name,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        prepMinutes: recipe.prepMinutes,
        calories: recipe.calories,
        tags: recipe.tags,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        notes: recipe.notes,
        shared: recipe.shared,
      },
      { new: true }
    )
      .populate<{ author: IUser }>("author")
      .lean();
  },
};
