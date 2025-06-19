import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Ingredient extends TimeStamps implements Base {
  public _id!: Types.ObjectId;
  public id!: string;

  @prop({ required: true, unique: true })
  public name!: string;

  @prop()
  public category?: string;

  @prop()
  public description?: string;
}

export const IngredientModel = getModelForClass(Ingredient);
