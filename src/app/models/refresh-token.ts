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
export class RefreshToken extends TimeStamps implements Base {
  public _id!: Types.ObjectId;
  public id!: string;

  @prop({ required: true })
  public value!: string;

  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;

  @prop({ expires: 0 })
  public expireAt?: Date;
}

export const RefreshTokenModel = getModelForClass(RefreshToken);
