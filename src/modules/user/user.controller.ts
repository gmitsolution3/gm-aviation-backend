import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { UserService } from "./user.service";
import { USER_MESSAGES } from "./user.constant";

const getUsers = catchAsync(async (req, res) => {
  const result = await UserService.getUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully.",
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const result = await UserService.getUser(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: USER_MESSAGES.SINGLE_RETRIEVED,
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const result =
    await UserService.updateUserRole(
      req.params.id as string,
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: USER_MESSAGES.ROLE_UPDATED,
    data: result,
  });
});

export const UserController = {
  getUsers,
  getUser,
  updateUserRole
};