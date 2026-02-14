/**
 * Auth Validators
 * Joi schemas for authentication endpoints.
 */

const Joi = require('joi');

const signup = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required',
    }),
});

const login = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({ 'any.required': 'Password is required' }),
});

const refreshToken = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

const verifyEmail = Joi.object({
  token: Joi.string().required().messages({ 'any.required': 'Verification token is required' }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'any.required': 'Email is required',
  }),
});

const resendConfirmation = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'any.required': 'Email is required',
  }),
});

module.exports = { signup, login, refreshToken, verifyEmail, resendConfirmation };
