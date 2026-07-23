import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { AdmissionConstants } from "./admission.constant";
import { AdmissionService } from "./admission.service";

const createAdmission = catchAsync(async (req, res) => {
  const result = await AdmissionService.createAdmission(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: AdmissionConstants.messages.created,
    data: result,
  });
});

const getMyAdmissions = catchAsync(async (req, res) => {
  const result = await AdmissionService.getMyAdmissions(
    req.params.userId as string,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: AdmissionConstants.messages.retrievedAll,
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmission = catchAsync(async (req, res) => {
  const result = await AdmissionService.getSingleAdmission(
    req.params.id as string,
    req.query.userId as string | undefined,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: AdmissionConstants.messages.retrieved,
    data: result,
  });
});

const getAllAdmissions = catchAsync(async (req, res) => {
  const result = await AdmissionService.getAllAdmissions(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: AdmissionConstants.messages.retrievedAll,
    meta: result.meta,
    data: result.data,
  });
});

const reviewAdmission = catchAsync(async (req, res) => {
  const result = await AdmissionService.reviewAdmission(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: AdmissionConstants.messages.reviewed,
    data: result,
  });
});

export const AdmissionController = {
  createAdmission,
  getMyAdmissions,
  getSingleAdmission,
  getAllAdmissions,
  reviewAdmission,
};