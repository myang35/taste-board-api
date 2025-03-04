import mongoose from "mongoose";

export interface IIngredient {
  name: string;
  category?: string;
  description?: string;
}

export const ingredientSchema = new mongoose.Schema<IIngredient>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
});

export const Ingredient = mongoose.model<IIngredient>(
  "Ingredient",
  ingredientSchema
);
