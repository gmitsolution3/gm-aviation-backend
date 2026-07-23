import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import generateUniqueSlug from "../../utils/generateUniqueSlug";
import normalizeString from "../../utils/normalizeString";
import validateObjectId from "../../utils/validateObjectId";

import { Category } from "../category/category.model";

import { CourseConstants } from "./course.constant";
import { Course } from "./course.model";
import {
  TCreateCoursePayload,
  TUpdateCoursePayload,
} from "./course.validation";

const createCourse = async (payload: TCreateCoursePayload) => {
  validateObjectId(payload.category, "Category");

  const category = await Category.findById(payload.category);

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const normalizedTitle = normalizeString(payload.title);

  const existingCourse = await Course.exists({
    title: normalizedTitle,
  });

  if (existingCourse) {
    throw new AppError(
      httpStatus.CONFLICT,
      CourseConstants.messages.alreadyExists,
    );
  }

  const slug = await generateUniqueSlug({
    value: normalizedTitle,
    model: Course,
  });

  const course = await Course.create({
    ...payload,
    title: normalizedTitle,
    slug,
  });

  return await course.populate("category");
};

const getAllCourses = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(Course.find(), query)
    .search(CourseConstants.searchableFields)
    .filter()
    .sort()
    .paginate();

  const data = await courseQuery.modelQuery.populate("category");

  const meta = await courseQuery.countTotal();

  return {
    meta,
    data,
  };
};

const getSingleCourse = async (id: string) => {
  validateObjectId(id, "Course");

  const course = await Course.findById(id).populate("category");

  if (!course) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CourseConstants.messages.notFound,
    );
  }

  return course;
};

const updateCourse = async (
  id: string,
  payload: TUpdateCoursePayload,
) => {
  validateObjectId(id, "Course");

  const course = await Course.findById(id);

  if (!course) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CourseConstants.messages.notFound,
    );
  }

  if (payload.category) {
    validateObjectId(payload.category, "Category");

    const category = await Category.findById(payload.category);

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    course.category = payload.category;
  }

  if (payload.title) {
    const normalizedTitle = normalizeString(payload.title);

    const existingCourse = await Course.exists({
      title: normalizedTitle,
      _id: { $ne: id },
    });

    if (existingCourse) {
      throw new AppError(
        httpStatus.CONFLICT,
        CourseConstants.messages.alreadyExists,
      );
    }

    course.title = normalizedTitle;

    course.slug = await generateUniqueSlug({
      value: normalizedTitle,
      model: Course,
      excludeId: id,
    });
  }

  Object.assign(course, {
    ...payload,
    title: course.title,
    slug: course.slug,
    category: course.category,
  });

  await course.save();

  return await course.populate("category");
};

const deleteCourse = async (id: string) => {
  validateObjectId(id, "Course");

  const course = await Course.findById(id);

  if (!course) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CourseConstants.messages.notFound,
    );
  }

  await course.deleteOne();
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
