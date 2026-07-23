import { z } from "zod";

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),

    category: z.string().trim().min(1, "Category is required"),

    description: z.string().trim().min(1, "Description is required"),

    image: z.string().trim().url("Image must be a valid URL"),

    duration: z.string().trim().min(1, "Duration is required"),

    fee: z
      .number({
        error: "Fee is required",
      })
      .min(0, "Fee cannot be negative"),

    checklists: z
      .array(z.string().trim().min(1))
      .min(1, "At least one checklist is required"),

    careerOpportunities: z
      .array(z.string().trim().min(1))
      .min(1, "At least one career opportunity is required"),

    availableShifts: z
      .array(z.string().trim().min(1))
      .min(1, "At least one available shift is required"),

    isAdmissionOpen: z.boolean().optional(),

    isFeatured: z.boolean().optional(),

    isPublished: z.boolean().optional(),

    isActive: z.boolean().optional(),
  }),
});

const updateCourseValidationSchema = z.object({
  body: createCourseValidationSchema.shape.body.partial(),
});

export const CourseValidation = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};

export type TCreateCoursePayload = z.infer<
  typeof createCourseValidationSchema
>["body"];

export type TUpdateCoursePayload = z.infer<
  typeof updateCourseValidationSchema
>["body"];