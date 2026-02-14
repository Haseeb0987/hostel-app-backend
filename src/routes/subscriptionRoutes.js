/**
 * Subscription Routes
 * Public plan endpoints + protected subscription endpoints.
 */

const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const subValidator = require('../validators/subscription.validator');

// ═══════════════════════════════════════════════
// Public Plan Endpoints
// ═══════════════════════════════════════════════

/**
 * @swagger
 * /api/subscriptions/plans:
 *   get:
 *     summary: Get all available subscription plans
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: Plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         plans:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Plan'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/plans', subscriptionController.getPlans);

/**
 * @swagger
 * /api/subscriptions/plans/{planId}:
 *   get:
 *     summary: Get a specific plan by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The plan ID
 *     responses:
 *       200:
 *         description: Plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         plan:
 *                           $ref: '#/components/schemas/Plan'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Plan not found
 *               error: PLAN_NOT_FOUND
 */
router.get('/plans/:planId', validate(subValidator.planIdParam, 'params'), subscriptionController.getPlanById);

// ═══════════════════════════════════════════════
// Protected Subscription Endpoints
// ═══════════════════════════════════════════════
router.use(authenticateToken);

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get all subscriptions for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User subscriptions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         subscriptions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/UserSubscription'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', subscriptionController.getUserSubscriptions);

/**
 * @swagger
 * /api/subscriptions/current:
 *   get:
 *     summary: Get the current active subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active subscription retrieved (or null if none)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         subscription:
 *                           nullable: true
 *                           allOf:
 *                             - $ref: '#/components/schemas/UserSubscription'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/current', subscriptionController.getUserActiveSubscription);

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription (cancels any existing active subscription)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the plan to subscribe to
 *               status:
 *                 type: string
 *                 enum: [active, trialing]
 *                 default: active
 *                 description: Initial subscription status
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         subscription:
 *                           $ref: '#/components/schemas/UserSubscription'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Plan not found or inactive
 */
router.post('/', validate(subValidator.createSubscription), subscriptionController.createSubscription);

/**
 * @swagger
 * /api/subscriptions/{subscriptionId}:
 *   put:
 *     summary: Update a subscription's status
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The subscription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, canceled, expired, trialing]
 *                 description: New subscription status
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         subscription:
 *                           $ref: '#/components/schemas/UserSubscription'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Subscription not found or access denied
 */
router.put(
  '/:subscriptionId',
  validate(subValidator.subscriptionIdParam, 'params'),
  validate(subValidator.updateSubscription),
  subscriptionController.updateSubscription,
);

/**
 * @swagger
 * /api/subscriptions/cancel:
 *   post:
 *     summary: Cancel the current active subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         subscription:
 *                           $ref: '#/components/schemas/UserSubscription'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No active subscription found to cancel
 */
router.post('/cancel', subscriptionController.cancelSubscription);

/**
 * @swagger
 * /api/subscriptions/access/{feature}:
 *   get:
 *     summary: Check if the user has access to a specific feature
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: feature
 *         required: true
 *         schema:
 *           type: string
 *           enum: [basic_features, advanced_features, priority_support, custom_integrations, dedicated_support]
 *         description: Feature name to check access for
 *     responses:
 *       200:
 *         description: Feature access checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         feature:
 *                           type: string
 *                           example: advanced_features
 *                         hasAccess:
 *                           type: boolean
 *                           example: true
 *                         userId:
 *                           type: string
 *                           format: uuid
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/access/:feature', validate(subValidator.featureParam, 'params'), subscriptionController.checkFeatureAccess);

module.exports = router;