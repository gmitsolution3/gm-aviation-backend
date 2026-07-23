import {
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";

export const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });

export type TCategory = InferSchemaType<typeof categorySchema>;

export const Category: Model<TCategory> =
  models.Category || model<TCategory>("Category", categorySchema);