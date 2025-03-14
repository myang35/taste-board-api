import mongoose from "mongoose";

export interface IRefreshToken {
  _id: string;
  value: string;
  user: mongoose.Schema.Types.ObjectId;
  expireAt: Date;
}

export const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  value: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expireAt: {
    type: Date,
    expires: 0,
  },
});

export const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);
