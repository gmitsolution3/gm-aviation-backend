import { Schema } from "mongoose";

export const addressInformationSchema = new Schema(
  {
    presentAddress: {
      type: String,
      trim: true,
    },

    permanentAddress: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);