import { ApiResponse } from "./ApiResponse.js";
import { ApiError } from "./ApiError.js";

const handleSuccessResponse = (res, status, data, message) => {
  return res.status(status).json(new ApiResponse(status, data, message));
};

const handleErrorResponse = (
  res,
  status = 500,
  error,
  message = "Internal Server Error"
) => {
  return res.status(status).json(new ApiError(status, error, message));
};

const throwAPIError = (
  error,
  {
    defaultStatus = 500,
    defaultError = "Unknown Error",
    defaultMessage = "An error occurred",
    logError = false,
    customHandler = null,
  } = {}
) => {
  if (customHandler && typeof customHandler === "function") {
    return customHandler(error);
  }
  if(logError || process.env.NODE_ENV==="development") {
    console.error("API ERROR: ", error);
  }

  if (error instanceof ApiError) {
    throw new ApiError(
      error.statusCode || defaultStatus,
      error.errors || defaultError,
      error.message || defaultMessage
    );
  }

  if (error?.response) {
    throw new ApiError(
      error.response.status || defaultStatus,
      error.response.data?.error || defaultError,
      error.response.data?.message || defaultMessage
    );
  } else if (error?.request) {
    throw new ApiError(
      defaultStatus,
      "No response received",
      "Failed to reach the API"
    );
  } else {
    throw new ApiError(
      defaultStatus,
      defaultError,
      defaultMessage || error?.message || "An unknown error occurred"
    );
  }
};

export { handleSuccessResponse, handleErrorResponse, throwAPIError };