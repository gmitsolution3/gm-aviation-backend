import { QueryBuilder } from "../../utils/QueryBuilder";

import { USER_MESSAGES, USER_SEARCHABLE_FIELDS } from "./user.constant";
import { User } from "./user.model";

import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import validateObjectId from "../../utils/validateObjectId";
import { TUpdateUserRolePayload } from "./user.types";

const getUsers = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  queryBuilder.search(USER_SEARCHABLE_FIELDS);

  queryBuilder.filter();

  queryBuilder.sort();

  queryBuilder.paginate();

  const data = await queryBuilder.modelQuery;

  const meta = await queryBuilder.countTotal();

  return {
    meta,
    data,
  };
};

const getUser = async (id: string) => {
  validateObjectId(id, "User");

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
  }

  return user;
};

const updateUserRole = async (
  id: string,
  payload: TUpdateUserRolePayload,
) => {
  validateObjectId(id, "User");

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      USER_MESSAGES.NOT_FOUND,
    );
  }

  if (user.role === payload.role) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      USER_MESSAGES.ROLE_ALREADY_ASSIGNED,
    );
  }

  user.role = payload.role;

  await user.save();

  return user;
};

export const UserService = {
  getUsers,
  getUser,
  updateUserRole,
};
