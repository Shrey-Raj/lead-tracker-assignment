import Joi from 'joi';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const dataToValidate = {};

    if (schema.body) {
      dataToValidate.body = req.body;
    }
    if (schema.query) {
      dataToValidate.query = req.query;
    }
    if (schema.params) {
      dataToValidate.params = req.params;
    }

    const validationObject = Joi.object(schema);

    const { error } = validationObject.validate(dataToValidate, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return next(new ApiError(400, errorMessage, "API Validation Error"));
    }

    next();
  };
};