import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import validateObjectId from "../../utils/validateObjectId";

import { CourseConstants } from "../course/course.constant";
import { Course } from "../course/course.model";
import "../user/user.model";

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
      AdmissionConstants.messages.inactiveCourse,
    );
  }

  if (!course.isPublished) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      AdmissionConstants.messages.unpublishedCourse,
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

  await admission.populate([
    {
      path: "course",
      select: "title slug",
    },
    {
      path: "user",
      select: "name email",
    },
  ]);

  return admission;
};

const getMyAdmissions = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  validateObjectId(userId, "User");

  const admissionQuery = new QueryBuilder(
    Admission.find({ user: userId }).populate({
      path: "course",
      select: "title slug thumbnail duration level isAdmissionOpen",
    }),
    {
      sort: "-createdAt",
      ...query,
    },
  )
    .search(admissionSearchableFields)
    .filter()
    .sort()
    .paginate();

  const data = await admissionQuery.modelQuery.lean();
  const meta = await admissionQuery.countTotal();

  return {
    meta,
    data,
  };
};

const getSingleAdmission = async (
  admissionId: string,
  userId?: string,
) => {
  validateObjectId(admissionId, "Admission");

  const filter: Record<string, unknown> = {
    _id: admissionId,
  };

  if (userId) {
    validateObjectId(userId, "User");
    filter.user = userId;
  }

  const admission = await Admission.findOne(filter)
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
    {
      sort: "-createdAt",
      ...query,
    },
  )
    .search(admissionSearchableFields)
    .filter()
    .sort()
    .paginate();

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
) => {
  validateObjectId(id, "Admission");

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
    reviewedAt: new Date(),
    remark: payload.remark,
  };

  await admission.save();

  await admission.populate([
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

  return admission;
};

export const AdmissionService = {
  createAdmission,
  getMyAdmissions,
  getSingleAdmission,
  getAllAdmissions,
  reviewAdmission,
};
