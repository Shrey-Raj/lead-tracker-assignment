import Joi from "joi";

export const createLeadSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    status: Joi.string().optional(),
  }),
};

export const updateLeadStatusSchema = {
  query: Joi.object({
    leadId: Joi.string().hex().length(24).required(),
  }),

  body: Joi.object({
    status: Joi.string().required(),
  }),
};

export const searchLeadsSchema = {
  query: Joi.object({
    query: Joi.string().required(),
  }),
};