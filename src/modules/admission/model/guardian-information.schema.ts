import { Schema } from "mongoose";

export const guardianInformationSchema = new Schema(
  {
    fatherName: {
      type: String,
      trim: true,
    },

    motherName: {
      type: String,
      trim: true,
    },

    guardianName: {
      type: String,
      trim: true,
    },

    relationship: {
      type: String,
      trim: true,
    },

    guardianPhone: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);