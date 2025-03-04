import { IIngredient } from "@src/app/models/ingredient";
import { HydratedDocument } from "mongoose";

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

  static fromDoc(ingredientDoc: HydratedDocument<IIngredient>) {
    return new IngredientDto({
      id: ingredientDoc.id,
      name: ingredientDoc.name,
      category: ingredientDoc.category,
      description: ingredientDoc.description,
    });
  }
}
