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
    description?: string;
    imageUrl?: string;
  }) => {
    const recipeDoc = await Recipe.create({
      name: recipe.name,
      author: recipe.authorId,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
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
    }
  ) => {
    return Recipe.findByIdAndUpdate(
      id,
      {
        author: recipe.authorId,
        name: recipe.name,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
      },
      { new: true }
    )
      .populate<{ author: IUser }>("author")
      .lean();
  },
};
