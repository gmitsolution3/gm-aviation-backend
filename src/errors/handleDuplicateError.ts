import httpStatus from "http-status";

import { TGenericErrorResponse } from "./error.types";

const handleDuplicateError = (error: {
  keyValue: Record<string, unknown>;
}): TGenericErrorResponse => {
  const field = Object.keys(error.keyValue)[0];

  return {
    statusCode: httpStatus.CONFLICT,
    message: "Duplicate value found",
    errorSources: [
      {
        path: field,
        message: `${field} already exists`,
      },
    ],
  };
};

export default handleDuplicateError;
