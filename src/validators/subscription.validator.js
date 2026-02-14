/**
 * Subscription Validators
 * Joi schemas for subscription endpoints.
 */

const Joi = require('joi');

const VALID_STATUSES = ['active', 'canceled', 'expired', 'trialing'];

const createSubscription = Joi.object({
  planId: Joi.string().uuid().required().messages({
    'any.required': 'Plan ID is required',
    'string.guid': 'Plan ID must be a valid UUID',
  }),
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .default('active'),
});

const updateSubscription = Joi.object({
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    }),
});

const planIdParam = Joi.object({
  planId: Joi.string().uuid().required(),
});

const subscriptionIdParam = Joi.object({
  subscriptionId: Joi.string().uuid().required(),
});

const featureParam = Joi.object({
  feature: Joi.string().min(1).required().messages({
    'any.required': 'Feature name is required',
  }),
});

module.exports = {
  createSubscription,
  updateSubscription,
  planIdParam,
  subscriptionIdParam,
  featureParam,
};
