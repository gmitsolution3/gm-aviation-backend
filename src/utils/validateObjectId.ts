import httpStatus from "http-status";
import mongoose from "mongoose";

import AppError from "../errors/AppError";

const validateObjectId = (
  id: string,
  entityName = "Resource",
): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid ${entityName} ID`,
    );
  }
};

export default validateObjectId;
