import { Model, Types } from "mongoose";
import slugify from "slugify";

import normalizeString from "./normalizeString";

type TGenerateUniqueSlugParams<T> = {
  value: string;
  model: Model<T>;
  excludeId?: string | Types.ObjectId;
};

const generateUniqueSlug = async <T>({
  value,
  model,
  excludeId,
}: TGenerateUniqueSlugParams<T>) => {
  const normalizedValue = normalizeString(value);

  const baseSlug = slugify(normalizedValue, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (await model.exists({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

export default generateUniqueSlug;