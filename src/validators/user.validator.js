/**
 * User Validators
 * Joi schemas for user endpoints.
 */

const Joi = require('joi');

const updateProfile = Joi.object({
  firstName: Joi.string().max(100).allow(''),
  lastName: Joi.string().max(100).allow(''),
  avatarUrl: Joi.string().uri().allow('', null),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

const changePassword = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'New password must be at least 6 characters long',
      'string.pattern.base':
        'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required',
    }),
});

const deleteAccount = Joi.object({
  confirmDelete: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must confirm account deletion',
    'any.required': 'Deletion confirmation is required',
  }),
});

module.exports = { updateProfile, changePassword, deleteAccount };
