/**
 * Validation Middleware
 * Generic Joi validation factory.
 * Schemas are defined in src/validators/ per domain.
 */

const ApiError = require('../utils/ApiError');

/**
 * Returns middleware that validates req[property] against a Joi schema.
 *
 * @param {import('joi').ObjectSchema} schema - Compiled Joi schema
 * @param {'body'|'params'|'query'} [property='body']
 * @returns {import('express').RequestHandler}
 */
const validate = (schema, property = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));

    return next(ApiError.badRequest('Validation failed', 'VALIDATION_ERROR', details));
  }

  req[property] = value;
  next();
};

module.exports = { validate };