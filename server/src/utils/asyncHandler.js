import { throwAPIError } from "./lib.js";
import { ApiError } from "../utils/ApiError.js";

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))

      .catch((err) => {
        if (err.code === 11000) {
          const key = Object.keys(err.keyValue || {})[0];
          const val = err.keyValue?.[key];
          throw throwAPIError(err, {
            defaultStatus: 400,
            defaultError: "Duplicate Key",
            defaultMessage: `${key} "${val}" already exists`,
          });
        }
        if (err.name === "ValidationError") {
          const msgs = Object.values(err.errors).map((e) => e.message);
          throw throwAPIError(err, {
            defaultStatus: 400,
            defaultError: "Validation Error",
            defaultMessage: msgs.join(", "),
          });
        }
        if (err.name === "CastError") {
          throw throwAPIError(err, {
            defaultStatus: 400,
            defaultError: "Invalid Data",
            defaultMessage: `Invalid ${err.path}: ${err.value}`,
          });
        }
        if (err.name === "DocumentNotFoundError") {
          throw throwAPIError(err, {
            defaultStatus: 404,
            defaultError: "Not Found",
            defaultMessage: "Resource not found",
          });
        }
        if (err.name === "VersionError") {
          throw throwAPIError(err, {
            defaultStatus: 409,
            defaultError: "Conflict",
            defaultMessage: "Document was modified by another process",
          });
        }

        throw err;
      })

      .catch((error) => {
        if (error instanceof ApiError) {
          return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error: error.errors,
          });
        }
        return next(error);
      });
  };
};

export { asyncHandler };
