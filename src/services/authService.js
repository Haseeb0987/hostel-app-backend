/**
 * Authentication Service
 * Business logic for Supabase auth operations.
 * Throws ApiError on failure so the error middleware can handle it.
 */

const { supabase } = require('../config/supabase');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

/** Utility: map raw Supabase user to a clean DTO. */
const toUserDTO = (user) => ({
  id: user.id,
  email: user.email,
  emailConfirmed: user.email_confirmed_at !== null,
  createdAt: user.created_at,
  lastSignIn: user.last_sign_in_at || null,
});

/**
 * Register a new user.
 */
const createUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { created_via: 'api', registration_date: new Date().toISOString() },
    },
  });

  if (error) throw ApiError.fromSupabaseAuth(error);

  return { user: toUserDTO(data.user), session: data.session };
};

/**
 * Authenticate with email & password.
 */
const authenticateUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw ApiError.fromSupabaseAuth(error);

  return { user: toUserDTO(data.user), session: data.session };
};

/**
 * Invalidate the user's session (logout).
 */
const logoutUser = async (accessToken) => {
  await supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
  const { error } = await supabase.auth.signOut();

  if (error) throw ApiError.fromSupabaseAuth(error);
};

/**
 * Refresh an access token using a refresh token.
 */
const refreshUserToken = async (refreshToken) => {
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error) throw ApiError.fromSupabaseAuth(error);

  return { user: toUserDTO(data.user), session: data.session };
};

/**
 * Send a password-reset email.
 */
const sendPasswordReset = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.frontendUrl}/reset-password`,
  });

  if (error) throw ApiError.fromSupabaseAuth(error);
};

/**
 * Verify email via OTP token.
 */
const verifyEmail = async (token, email) => {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

  if (error) throw ApiError.fromSupabaseAuth(error);

  return { user: toUserDTO(data.user), session: data.session };
};

/**
 * Resend sign-up confirmation email.
 */
const resendConfirmation = async (email) => {
  const { error } = await supabase.auth.resend({ type: 'signup', email });

  if (error) throw ApiError.fromSupabaseAuth(error);
};

module.exports = {
  createUser,
  authenticateUser,
  logoutUser,
  refreshUserToken,
  sendPasswordReset,
  verifyEmail,
  resendConfirmation,
};