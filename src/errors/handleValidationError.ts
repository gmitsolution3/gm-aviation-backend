import httpStatus from "http-status";
import { Error } from "mongoose";

import { TGenericErrorResponse } from "./error.types";

const handleValidationError = (
  error: Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources = Object.values(error.errors).map((value) => ({
    path: value.path,
    message: value.message,
  }));

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation Error",
    errorSources,
  };
};

export default handleValidationError;
