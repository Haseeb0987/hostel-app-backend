/**
 * User Controller
 * Thin HTTP layer for user profile operations.
 */

const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getProfile = asyncHandler(async (req, res) => {
  ApiResponse.success(res, {
    message: 'Profile retrieved successfully',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        emailConfirmed: req.user.emailConfirmed,
        createdAt: req.user.createdAt,
        lastSignIn: req.user.lastSignIn,
      },
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUserProfile(req.user.id, req.body);

  ApiResponse.success(res, {
    message: 'Profile updated successfully',
    data: { user: updatedUser },
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  await userService.deleteUserAccount(req.user.id);

  ApiResponse.success(res, { message: 'Account deleted successfully' });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changeUserPassword(req.user.id, currentPassword, newPassword);

  ApiResponse.success(res, { message: 'Password changed successfully' });
});

module.exports = { getProfile, updateProfile, deleteAccount, changePassword };