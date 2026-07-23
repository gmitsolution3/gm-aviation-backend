import { courseSearchableFields } from "./course.types";

export const CourseConstants = {
  searchableFields: courseSearchableFields,

  messages: {
    created: "Course created successfully",
    retrieved: "Course retrieved successfully",
    retrievedAll: "Courses retrieved successfully",
    updated: "Course updated successfully",
    deleted: "Course deleted successfully",

    alreadyExists: "Course already exists",
    notFound: "Course not found",
  },
} as const;