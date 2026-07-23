/**
 * Better Auth User Collection
 *
 * This model maps to Better Auth's existing
 * "user" collection.
 */

import { Schema, model } from "mongoose";
import { TUser, EUserRole } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    emailVerified: {
      type: Boolean,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: Object.values(EUserRole),
      required: true,
    },
  },
  {
    collection: "user",

    timestamps: true,

    versionKey: false,
  },
);

export const User = model<TUser>(
  "User",
  userSchema,
);