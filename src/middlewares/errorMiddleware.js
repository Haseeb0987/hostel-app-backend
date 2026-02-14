/**
 * Centralized Error Handling Middleware
 * Converts all errors to the standard API response format.
 */

const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * 404 handler – catches requests to undefined routes.
 */
const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found – ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
};

/**
 * Global error handler.
 * Normalizes any thrown error into a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Already an ApiError – use it directly
  if (err instanceof ApiError) {
    logger.error(err.message, { statusCode: err.statusCode, url: req.originalUrl });
    return ApiResponse.error(res, {
      statusCode: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
      details: err.details,
    });
  }

  // JWT library errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, { statusCode: 401, message: 'Invalid token', errorCode: 'INVALID_TOKEN' });
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, { statusCode: 401, message: 'Token expired', errorCode: 'TOKEN_EXPIRED' });
  }

  // Joi / express validation
  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, { statusCode: 400, message: err.message, errorCode: 'VALIDATION_ERROR' });
  }

  // Fallback: unexpected errors
  logger.error('Unhandled error', {
    message: err.message,
    stack: env.isDevelopment ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  return ApiResponse.error(res, {
    statusCode: 500,
    message: env.isProduction ? 'Internal server error' : err.message,
    errorCode: 'INTERNAL_ERROR',
  });
};

module.exports = { notFound, errorHandler };