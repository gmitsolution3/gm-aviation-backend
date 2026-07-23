import { Schema } from "mongoose";

export const educationInformationSchema = new Schema(
  {
    highestQualification: {
      type: String,
      trim: true,
    },

    institutionName: {
      type: String,
      trim: true,
    },

    passingYear: Number,

    result: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);