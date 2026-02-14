/**
 * User Service
 * Business logic for user profile operations.
 */

const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Get user profile by ID.
 * Extend to query a `profiles` table when ready.
 */
const getUserById = async (userId) => {
  // Placeholder – replace with real profiles table query when created.
  return { id: userId };
};

/**
 * Update user profile fields.
 */
const updateUserProfile = async (userId, updates) => {
  // Placeholder – replace with real profiles table update.
  return { id: userId, ...updates, updatedAt: new Date().toISOString() };
};

/**
 * Soft-delete (or hard-delete) a user account.
 */
const deleteUserAccount = async (userId) => {
  // Placeholder – implement soft-delete via profiles table or Supabase admin API.
  logger.info('Account deletion requested', { userId });
};

/**
 * Change user password.
 * Requires a proper auth flow – kept as a placeholder to preserve business logic.
 */
const changeUserPassword = async (_userId, _currentPassword, _newPassword) => {
  // In production, use supabase.auth.updateUser or re-auth flow.
  const ApiError = require('../utils/ApiError');
  throw ApiError.badRequest(
    'Password changes should be implemented with proper authentication flow',
    'NOT_IMPLEMENTED',
  );
};

/**
 * Get user activity logs (placeholder).
 */
const getUserActivity = async (userId, limit = 10) => {
  // Placeholder – replace with real activity log query.
  return [
    { id: 1, userId, action: 'login', timestamp: new Date().toISOString() },
  ].slice(0, limit);
};

module.exports = {
  getUserById,
  updateUserProfile,
  deleteUserAccount,
  changeUserPassword,
  getUserActivity,
};