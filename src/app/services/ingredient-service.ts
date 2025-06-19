import { IngredientModel } from "@src/app/models/ingredient";
import { Types } from "mongoose";

export const ingredientService = {
  getAll: async (options?: { distinct?: string }) => {
    const query = IngredientModel.find();

    if (options?.distinct) {
      query.distinct(options.distinct);
    }

    return query;
  },
  getById: async (id: Types.ObjectId | string) => {
    return IngredientModel.findById(id);
  },
  create: async (
    ingredients: { name: string; category?: string; description?: string }[]
  ) => {
    return IngredientModel.insertMany(
      {
        category: "",
        description: "",
        ...ingredients,
      },
      {
        ordered: false,
      }
    ).catch((error) => {
      if (error.insertedDocs) {
        return error.insertedDocs;
      }
      return [];
    });
  },
  deleteById: async (id: Types.ObjectId | string) => {
    return IngredientModel.findByIdAndDelete(id);
  },
  updateById: async (
    id: Types.ObjectId | string,
    ingredient: { name?: string; category?: string; description?: string }
  ) => {
    return IngredientModel.findByIdAndUpdate(id, ingredient, { new: true });
  },
};
