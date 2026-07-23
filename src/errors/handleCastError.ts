import httpStatus from "http-status";
import { Error } from "mongoose";

import { TGenericErrorResponse } from "./error.types";

const handleCastError = (
  error: Error.CastError,
): TGenericErrorResponse => {
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Invalid ID",
    errorSources: [
      {
        path: error.path,
        message: error.message,
      },
    ],
  };
};

export default handleCastError;
