import { Response } from "express";
import { TResponse } from "../types";

const sendResponse = <T>(
  res: Response,
  payload: TResponse<T>,
): void => {
  const { success, statusCode, message, meta, data } = payload;

  res.status(statusCode).json({
    success,
    statusCode,
    message,
    meta,
    data,
  });
};

export default sendResponse;
