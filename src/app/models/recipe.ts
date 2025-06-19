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
  public description?: string;

  @prop()
  public imageUrl?: string;

  @prop()
  public prepMinutes?: number;

  @prop()
  public calories?: number;

  @prop({ type: () => [String] })
  public tags?: string[];

  @prop({ type: () => [Ingredient] })
  public ingredients?: Ingredient[];

  @prop({ type: () => [String], required: true })
  public steps!: string[];

  @prop()
  public notes?: string;

  @prop({ required: true })
  public shared!: boolean;

  @prop({ type: () => [View] })
  public views?: View[];
}

export class Ingredient {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public amount!: number;

  @prop({ required: true })
  public unit!: string;
}

export class View {
  @prop({ ref: () => User, required: true })
  public viewer!: Ref<User>;

  @prop({ default: Date.now })
  public date?: Date;
}

export const RecipeModel = getModelForClass(Recipe);
