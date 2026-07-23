export const courseSearchableFields = ["title"] as const;

export type TCourseSearchableField =
  (typeof courseSearchableFields)[number];