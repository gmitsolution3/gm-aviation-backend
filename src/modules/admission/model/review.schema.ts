import { Schema } from "mongoose";

export const reviewSchema = new Schema(
  {
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: Date,

    remark: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);