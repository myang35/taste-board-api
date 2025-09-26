import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
import { User } from "./user";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Recipe extends TimeStamps implements Base {
  public _id!: Types.ObjectId;
  public id!: string;

  @prop({ ref: () => User, required: true })
  public author!: Ref<User>;

  @prop({ required: true })
  public name!: string;

  @prop()
  public servings?: number;

  @prop({ default: "" })
  public description?: string;

  @prop()
  public prepMinutes?: number;

  @prop()
  public cookMinutes?: number;

  @prop()
  public difficulty?: number;

  @prop({ default: "" })
  public imageUrl?: string;

  @prop({ type: () => [String], default: [] })
  public tags?: string[];

  @prop({ type: () => [Ingredient], default: [] })
  public ingredients?: Ingredient[];

  @prop({ type: () => [Instruction], default: [] })
  public instructions?: Instruction[];

  @prop()
  public calories?: number;

  @prop()
  public proteinGrams?: number;

  @prop()
  public carbohydratesGrams?: number;

  @prop()
  public fatGrams?: number;

  @prop()
  public fiberGrams?: number;

  @prop()
  public sugarGrams?: number;

  @prop({ default: "" })
  public notes?: string;

  @prop({ default: false })
  public shared?: boolean;

  @prop({ type: () => [View], default: [] })
  public views?: View[];
}

export class Ingredient {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public amount!: number;

  @prop({ required: true })
  public unit!: string;

  @prop()
  public notes?: string;
}

export class Instruction {
  @prop({ required: true })
  public description!: string;

  @prop()
  public minutes?: number;
}

export class View {
  @prop({ ref: () => User, required: true })
  public viewer!: Ref<User>;

  @prop({ default: Date.now })
  public date?: Date;
}

export const RecipeModel = getModelForClass(Recipe);
