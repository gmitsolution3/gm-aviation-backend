import { Schema } from "mongoose";

export const aviationInformationSchema = new Schema(
  {
    passportNumber: {
      type: String,
      trim: true,
    },

    height: Number,

    weight: Number,

    medicalInformation: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);