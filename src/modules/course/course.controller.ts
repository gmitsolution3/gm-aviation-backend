import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { CourseConstants } from "./course.constant";
import { CourseService } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: CourseConstants.messages.created,
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseService.getAllCourses(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: CourseConstants.messages.retrievedAll,
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const result = await CourseService.getSingleCourse(
    req.params.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: CourseConstants.messages.retrieved,
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const result = await CourseService.updateCourse(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: CourseConstants.messages.updated,
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  await CourseService.deleteCourse(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: CourseConstants.messages.deleted,
    data: null,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};