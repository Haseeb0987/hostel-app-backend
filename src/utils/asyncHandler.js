/**
 * Async Handler Wrapper
 * Eliminates repetitive try-catch blocks in controllers.
 * Catches errors and forwards them to the centralized error middleware.
 *
 * @param {Function} fn - Async route handler (req, res, next) => Promise
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
