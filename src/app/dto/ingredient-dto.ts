import { Ingredient } from "../models/ingredient";

export class IngredientDto {
  id: string;
  name: string;
  category: string;
  description: string;

  constructor(params: {
    id: string;
    name: string;
    category?: string;
    description?: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.category = params.category ?? "";
    this.description = params.description ?? "";
  }

  static fromDoc(ingredientDoc: Ingredient) {
    return new IngredientDto({
      id: ingredientDoc._id.toString(),
      name: ingredientDoc.name,
      category: ingredientDoc.category,
      description: ingredientDoc.description,
    });
  }
}
