import { IIngredient, Ingredient } from "@src/app/models/ingredient";

export const ingredientService = {
  getAll: async (options?: { distinct?: string }) => {
    const query = Ingredient.find();

    if (options?.distinct) {
      query.distinct(options.distinct);
    }

    return query;
  },
  get: async (id: string) => {
    return Ingredient.findById(id);
  },
  create: async (ingredients: IIngredient[]) => {
    return Ingredient.insertMany(ingredients, {
      ordered: false,
    }).catch((error) => {
      if (error.insertedDocs) {
        return error.insertedDocs;
      }
      return [];
    });
  },
  delete: async (id: string) => {
    return Ingredient.findByIdAndDelete(id);
  },
  update: async (id: string, ingredient: Partial<IIngredient>) => {
    return Ingredient.findByIdAndUpdate(id, ingredient, { new: true });
  },
};
