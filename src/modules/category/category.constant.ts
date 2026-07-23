import { categorySearchableFields } from "./category.types";

export const CategoryConstants = {
  searchableFields: [...categorySearchableFields],

  messages: {
    created: "Category created successfully",
    retrieved: "Category retrieved successfully",
    retrievedAll: "Categories retrieved successfully",
    updated: "Category updated successfully",
    deleted: "Category deleted successfully",
    notFound: "Category not found",
    alreadyExists: "Category already exists",
  },
} as const;