/**
 * Auth Controller
 * Thin HTTP layer – delegates to authService, uses asyncHandler & ApiResponse.
 */

const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.createUser(email, password);

  ApiResponse.created(res, {
    message: 'Account created successfully. Please check your email for verification.',
    data: { user: result.user, session: result.session },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.authenticateUser(email, password);

  ApiResponse.success(res, {
    message: 'Login successful',
    data: {
      user: result.user,
      session: result.session,
      accessToken: result.session.access_token,
      refreshToken: result.session.refresh_token,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) throw ApiError.badRequest('No token provided', 'MISSING_TOKEN');

  await authService.logoutUser(token);

  ApiResponse.success(res, { message: 'Logout successful' });
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshUserToken(req.body.refreshToken);

  ApiResponse.success(res, {
    message: 'Token refreshed successfully',
    data: {
      session: result.session,
      accessToken: result.session.access_token,
      refreshToken: result.session.refresh_token,
    },
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token, email } = req.body;
  const result = await authService.verifyEmail(token, email);

  ApiResponse.success(res, {
    message: 'Email verified successfully',
    data: { user: result.user, session: result.session },
  });
});

const resendConfirmation = asyncHandler(async (req, res) => {
  await authService.resendConfirmation(req.body.email);

  ApiResponse.success(res, { message: 'Confirmation email sent successfully' });
});

module.exports = { signup, login, logout, refreshToken, verifyEmail, resendConfirmation };