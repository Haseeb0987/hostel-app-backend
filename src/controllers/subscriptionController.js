/**
 * Subscription Controller
 * Thin HTTP layer for plan & subscription operations.
 */

const subscriptionService = require('../services/subscriptionService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getPlans = asyncHandler(async (_req, res) => {
  const plans = await subscriptionService.getAllPlans();
  ApiResponse.success(res, { message: 'Plans retrieved successfully', data: { plans } });
});

const getPlanById = asyncHandler(async (req, res) => {
  const plan = await subscriptionService.getPlanById(req.params.planId);
  if (!plan) throw ApiError.notFound('Plan not found', 'PLAN_NOT_FOUND');

  ApiResponse.success(res, { message: 'Plan retrieved successfully', data: { plan } });
});

const getUserSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await subscriptionService.getUserSubscriptions(req.user.id);
  ApiResponse.success(res, { message: 'User subscriptions retrieved successfully', data: { subscriptions } });
});

const getUserActiveSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.getUserActiveSubscription(req.user.id);
  ApiResponse.success(res, {
    message: subscription ? 'Active subscription retrieved successfully' : 'No active subscription found',
    data: { subscription },
  });
});

const createSubscription = asyncHandler(async (req, res) => {
  const { planId, status } = req.body;
  const subscription = await subscriptionService.createSubscription(req.user.id, planId, { status });

  ApiResponse.created(res, { message: 'Subscription created successfully', data: { subscription } });
});

const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.updateSubscriptionStatus(
    req.params.subscriptionId,
    req.user.id,
    req.body.status,
  );

  if (!subscription) throw ApiError.notFound('Subscription not found or access denied', 'SUBSCRIPTION_NOT_FOUND');

  ApiResponse.success(res, { message: 'Subscription updated successfully', data: { subscription } });
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.cancelUserActiveSubscription(req.user.id);
  if (!subscription) throw ApiError.notFound('No active subscription found to cancel', 'NO_ACTIVE_SUBSCRIPTION');

  ApiResponse.success(res, { message: 'Subscription canceled successfully', data: { subscription } });
});

const checkFeatureAccess = asyncHandler(async (req, res) => {
  const { feature } = req.params;
  const hasAccess = await subscriptionService.checkUserAccess(req.user.id, feature);

  ApiResponse.success(res, {
    message: 'Feature access checked successfully',
    data: { feature, hasAccess, userId: req.user.id },
  });
});

module.exports = {
  getPlans,
  getPlanById,
  getUserSubscriptions,
  getUserActiveSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  checkFeatureAccess,
};