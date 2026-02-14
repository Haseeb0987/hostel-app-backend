/**
 * Authentication Middleware
 * Verifies Supabase JWT and attaches user to req.
 */

const { supabase } = require('../config/supabase');
const ApiError = require('../utils/ApiError');

/**
 * Extract Bearer token from Authorization header.
 * @param {import('express').Request} req
 * @returns {string|null}
 */
const extractToken = (req) => {
  const header = req.header('Authorization');
  return header && header.startsWith('Bearer ') ? header.substring(7) : null;
};

/**
 * Map raw Supabase user to a clean user object.
 */
const mapUser = (user) => ({
  id: user.id,
  email: user.email,
  emailConfirmed: user.email_confirmed_at !== null,
  createdAt: user.created_at,
  lastSignIn: user.last_sign_in_at,
});

/**
 * Required authentication – rejects unauthenticated requests.
 */
const authenticateToken = async (req, _res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw ApiError.unauthorized('Access token required', 'MISSING_TOKEN');
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw ApiError.unauthorized('Invalid or expired token', 'INVALID_TOKEN');
    }

    req.user = mapUser(user);
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : ApiError.unauthorized('Authentication error', 'AUTH_ERROR'));
  }
};

/**
 * Optional authentication – attaches user if token is present but does not reject.
 */
const optionalAuthentication = async (req, _res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = mapUser(user);
      }
    }

    next();
  } catch (_err) {
    next(); // Silently continue
  }
};

module.exports = { authenticateToken, optionalAuthentication };