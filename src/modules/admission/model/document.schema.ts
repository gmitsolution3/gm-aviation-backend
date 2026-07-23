import { Schema } from "mongoose";

export const documentSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);