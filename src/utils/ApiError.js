/**
 * Custom API Error Class
 * Extends Error with HTTP status codes and structured error info.
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable error message
   * @param {string} [errorCode] - Machine-readable error code (e.g. 'EMAIL_ALREADY_EXISTS')
   * @param {Array} [details] - Validation error details
   */
  constructor(statusCode, message, errorCode = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  // --- Factory methods for common errors ---

  static badRequest(message, errorCode, details) {
    return new ApiError(400, message, errorCode, details);
  }

  static unauthorized(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
    return new ApiError(401, message, errorCode);
  }

  static forbidden(message = 'Forbidden', errorCode = 'FORBIDDEN') {
    return new ApiError(403, message, errorCode);
  }

  static notFound(message = 'Resource not found', errorCode = 'NOT_FOUND') {
    return new ApiError(404, message, errorCode);
  }

  static conflict(message, errorCode = 'CONFLICT') {
    return new ApiError(409, message, errorCode);
  }

  static tooMany(message = 'Too many requests', errorCode = 'RATE_LIMIT_EXCEEDED') {
    return new ApiError(429, message, errorCode);
  }

  static internal(message = 'Internal server error', errorCode = 'INTERNAL_ERROR') {
    return new ApiError(500, message, errorCode);
  }

  /**
   * Maps common Supabase auth error messages to structured ApiErrors.
   * @param {Error} error - Original Supabase error
   * @returns {ApiError}
   */
  static fromSupabaseAuth(error) {
    const msg = error.message || '';

    if (msg.includes('rate limit exceeded') || msg.includes('too many requests') || msg.includes('email rate limit exceeded')) {
      return ApiError.tooMany('Too many requests. Please wait before trying again.', 'RATE_LIMIT_EXCEEDED');
    }
    if (msg.includes('already registered') || msg.includes('User already registered')) {
      return ApiError.conflict('An account with this email already exists', 'EMAIL_ALREADY_EXISTS');
    }
    if (msg.includes('Invalid email')) {
      return ApiError.badRequest('Please provide a valid email address', 'INVALID_EMAIL');
    }
    if (msg.includes('signup disabled')) {
      return ApiError.forbidden('New user registration is currently disabled', 'SIGNUP_DISABLED');
    }
    if (msg.includes('Password')) {
      return ApiError.badRequest(msg, 'PASSWORD_POLICY_ERROR');
    }
    if (msg.includes('Invalid login credentials')) {
      return ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }
    if (msg.includes('Email not confirmed')) {
      return ApiError.unauthorized('Please verify your email before logging in', 'EMAIL_NOT_VERIFIED');
    }
    if (msg.includes('Invalid refresh token') || msg.includes('already used')) {
      return ApiError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }
    if (msg.includes('Invalid') || msg.includes('expired')) {
      return ApiError.badRequest('Invalid or expired token', 'INVALID_TOKEN');
    }
    if (msg.includes('already confirmed')) {
      return ApiError.badRequest('Email is already confirmed', 'EMAIL_ALREADY_CONFIRMED');
    }
    if (msg.includes('Invalid credentials')) {
      return ApiError.unauthorized('Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
    }

    return ApiError.internal(msg || 'An unexpected authentication error occurred');
  }
}

module.exports = ApiError;
