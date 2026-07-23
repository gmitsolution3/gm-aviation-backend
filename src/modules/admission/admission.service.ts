import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import validateObjectId from "../../utils/validateObjectId";

import { CourseConstants } from "../course/course.constant";
import { Course } from "../course/course.model";

import mongoose from "mongoose";
import {
  AdmissionConstants,
  admissionSearchableFields,
} from "./admission.constant";
import { EAdmissionStatus } from "./admission.enum";
import { Admission } from "./admission.model";
import {
  TCreateAdmissionPayload,
  TReviewAdmissionPayload,
} from "./admission.validation";

const validateStatusTransition = (
  currentStatus: EAdmissionStatus,
  nextStatus: EAdmissionStatus,
) => {
  const allowedTransitions: Record<
    EAdmissionStatus,
    EAdmissionStatus[]
  > = {
    [EAdmissionStatus.SUBMITTED]: [EAdmissionStatus.UNDER_REVIEW],

    [EAdmissionStatus.UNDER_REVIEW]: [
      EAdmissionStatus.APPROVED,
      EAdmissionStatus.REJECTED,
    ],

    [EAdmissionStatus.APPROVED]: [],

    [EAdmissionStatus.REJECTED]: [],
  };

  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      AdmissionConstants.messages.invalidStatusTransition,
    );
  }
};

const createAdmission = async (payload: TCreateAdmissionPayload) => {
  validateObjectId(payload.user, "User");
  validateObjectId(payload.course, "Course");

  const course = await Course.findById(payload.course);

  if (!course) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CourseConstants.messages.notFound,
    );
  }

  if (!course.isActive) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is currently inactive.",
    );
  }

  if (!course.isPublished) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is not available for admission.",
    );
  }

  if (!course.isAdmissionOpen) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      AdmissionConstants.messages.admissionClosed,
    );
  }

  const alreadyApplied = await Admission.exists({
    user: payload.user,
    course: payload.course,
  });

  if (alreadyApplied) {
    throw new AppError(
      httpStatus.CONFLICT,
      AdmissionConstants.messages.alreadyApplied,
    );
  }

  const admission = await Admission.create(payload);

  return admission.populate([
    {
      path: "course",
      select: "title slug",
    },
    {
      path: "user",
      select: "name email",
    },
  ]);
};

const getMyAdmissions = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  validateObjectId(userId, "User");

  const admissionQuery = new QueryBuilder(
    Admission.find({ user: userId })
      .populate({
        path: "course",
        select: "title slug thumbnail duration level isAdmissionOpen",
      })
      .sort("-createdAt"),
    query,
  )
    .search(admissionSearchableFields)
    .filter()
    .sort()
    .paginate()

  const data = await admissionQuery.modelQuery.lean();
  const meta = await admissionQuery.countTotal();

  return {
    meta,
    data,
  };
};

const getSingleAdmission = async (id: string) => {
  validateObjectId(id, "Admission");

  const admission = await Admission.findById(id)
    .populate({
      path: "course",
      select: "title slug thumbnail duration level description",
    })
    .populate({
      path: "user",
      select: "name email",
    })
    .lean();

  if (!admission) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      AdmissionConstants.messages.notFound,
    );
  }

  return admission;
};

const getAllAdmissions = async (query: Record<string, unknown>) => {
  const admissionQuery = new QueryBuilder(
    Admission.find()
      .populate({
        path: "course",
        select: "title slug thumbnail duration level isAdmissionOpen",
      })
      .populate({
        path: "user",
        select: "name email",
      }),
    query,
  )
    .search(admissionSearchableFields)
    .filter()
    .sort()
    .paginate()

  const data = await admissionQuery.modelQuery.lean();
  const meta = await admissionQuery.countTotal();

  return {
    meta,
    data,
  };
};

const reviewAdmission = async (
  id: string,
  payload: TReviewAdmissionPayload,
  reviewedBy: string,
) => {
  validateObjectId(id, "Admission");
  validateObjectId(reviewedBy, "User");

  const admission = await Admission.findById(id);

  if (!admission) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      AdmissionConstants.messages.notFound,
    );
  }

  validateStatusTransition(admission.status, payload.status);

  admission.status = payload.status;

  admission.review = {
    reviewedBy: new mongoose.Types.ObjectId(reviewedBy),
    reviewedAt: new Date(),
    remark: payload.remark,
  };

  await admission.save();

  return admission.populate([
    {
      path: "course",
      select: "title slug",
    },
    {
      path: "user",
      select: "name email",
    },
    {
      path: "review.reviewedBy",
      select: "name email",
    },
  ]);
};

export const AdmissionService = {
  createAdmission,
  getMyAdmissions,
  getSingleAdmission,
  getAllAdmissions,
  reviewAdmission,
};
