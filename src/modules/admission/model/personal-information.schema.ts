import { Schema } from "mongoose";

import { EBloodGroup, EGender } from "../admission.enum";

export const personalInformationSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    dateOfBirth: Date,

    gender: {
      type: String,
      enum: Object.values(EGender),
    },

    bloodGroup: {
      type: String,
      enum: Object.values(EBloodGroup),
    },

    nationality: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);