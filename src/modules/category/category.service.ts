import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import generateUniqueSlug from "../../utils/generateUniqueSlug";
import normalizeString from "../../utils/normalizeString";
import validateObjectId from "../../utils/validateObjectId";

import { CategoryConstants } from "./category.constant";
import { Category } from "./category.model";
import {
  TCreateCategoryPayload,
  TUpdateCategoryPayload,
} from "./category.validation";

const createCategory = async (payload: TCreateCategoryPayload) => {
  const normalizedName = normalizeString(payload.name);

  const existingCategory = await Category.exists({
    name: normalizedName,
  });

  if (existingCategory) {
    throw new AppError(
      httpStatus.CONFLICT,
      CategoryConstants.messages.alreadyExists,
    );
  }

  const slug = await generateUniqueSlug({
    value: normalizedName,
    model: Category,
  });

  const category = await Category.create({
    name: normalizedName,
    slug,
  });

  return category;
};

const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(CategoryConstants.searchableFields)
    .filter()
    .sort()
    .paginate();

  const data = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  return {
    meta,
    data,
  };
};

const getSingleCategory = async (id: string) => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CategoryConstants.messages.notFound,
    );
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: TUpdateCategoryPayload,
) => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CategoryConstants.messages.notFound,
    );
  }

  if (payload.name) {
    const normalizedName = normalizeString(payload.name);

    const existingCategory = await Category.findOne({
      name: normalizedName,
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw new AppError(
        httpStatus.CONFLICT,
        CategoryConstants.messages.alreadyExists,
      );
    }

    category.name = normalizedName;

    category.slug = await generateUniqueSlug({
      value: normalizedName,
      model: Category,
      excludeId: category._id.toString(),
    });
  }

  await category.save();

  return category;
};

const deleteCategory = async (id: string) => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CategoryConstants.messages.notFound,
    );
  }

  await category.deleteOne();

  return null;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
