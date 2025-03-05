import { IIngredient } from "@src/app/models/ingredient";

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

  static fromDoc(ingredientDoc: IIngredient) {
    return new IngredientDto({
      id: ingredientDoc._id,
      name: ingredientDoc.name,
      category: ingredientDoc.category,
      description: ingredientDoc.description,
    });
  }
}
