export const categorySearchableFields = ["name"] as const;

export type TCategorySearchableField =
  (typeof categorySearchableFields)[number];