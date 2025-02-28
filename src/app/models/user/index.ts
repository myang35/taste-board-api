import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string;
}

export const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
