/**
 * Auth Routes
 * All /api/auth endpoints.
 * Swagger annotations kept as-is for API docs.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middlewares/validationMiddleware');
const authValidator = require('../validators/auth.validator');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email already exists
 */
router.post('/signup', validate(authValidator.signup), authController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get JWT tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(authValidator.login), authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and invalidate session
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh', validate(authValidator.refreshToken), authController.refreshToken);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email with OTP token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Email verified
 */
router.post('/verify-email', validate(authValidator.verifyEmail), authController.verifyEmail);

/**
 * @swagger
 * /api/auth/resend-confirmation:
 *   post:
 *     summary: Resend confirmation email
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Confirmation sent
 */
router.post('/resend-confirmation', validate(authValidator.resendConfirmation), authController.resendConfirmation);

module.exports = router;