import mongoose from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  imgUrl: string;
}

export const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  imgUrl: String,
});

export const User = mongoose.model<IUser>("User", userSchema);
