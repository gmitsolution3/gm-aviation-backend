import { InferSchemaType, Schema, model, models } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    fee: {
      type: Number,
      required: true,
      min: 0,
    },

    checklists: {
      type: [String],
      required: true,
    },

    careerOpportunities: {
      type: [String],
      required: true,
    },

    availableShifts: {
      type: [String],
      required: true,
    },

    isAdmissionOpen: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

courseSchema.index({ title: 1 });
courseSchema.index({ slug: 1 });
courseSchema.index({ category: 1 });

export type TCourse = InferSchemaType<typeof courseSchema>;

export const Course =
  models.Course || model("Course", courseSchema);