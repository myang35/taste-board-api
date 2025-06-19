import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class User extends TimeStamps implements Base {
  public _id!: Types.ObjectId;
  public id!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop()
  public name?: string;

  @prop()
  public imageUrl?: string;
}

export const UserModel = getModelForClass(User);
