import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);

    const safeMessage =
      statusCode >= 500 ? "Something went wrong" : error.message;

    error = new ApiError(statusCode, [], safeMessage, err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  console.error(err); // always log server-side

  return res.status(error.statusCode).json(response);
};

export { errorHandler };