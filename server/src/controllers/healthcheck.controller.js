import { asyncHandler } from "../utils/asyncHandler.js";
import { handleSuccessResponse } from "../utils/lib.js";

const healthCheck = asyncHandler(async (req, res) => {
  handleSuccessResponse(res, 200, {message: "OK"}, "Health check successful");
});

export { healthCheck };
