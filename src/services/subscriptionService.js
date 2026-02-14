/**
 * Subscription Service
 * Business logic for plans and subscriptions.
 * Uses model layer for all DB access.
 */

const planModel = require('../models/plan.model');
const subscriptionModel = require('../models/subscription.model');
const ApiError = require('../utils/ApiError');

/** Feature access map per plan name. */
const PLAN_FEATURES = {
  Free: ['basic_features'],
  Pro: ['basic_features', 'advanced_features', 'priority_support'],
  Enterprise: [
    'basic_features',
    'advanced_features',
    'priority_support',
    'custom_integrations',
    'dedicated_support',
  ],
};

// ──────────────────── Plans ────────────────────

const getAllPlans = () => planModel.findAllActive();

const getPlanById = (planId) => planModel.findActiveById(planId);

// ──────────────────── Subscriptions ────────────────────

const getUserSubscriptions = (userId) => subscriptionModel.findByUser(userId);

const getUserActiveSubscription = (userId) => subscriptionModel.findActiveByUser(userId);

/**
 * Create a new subscription, cancelling any existing active one first.
 */
const createSubscription = async (userId, planId, extra = {}) => {
  const plan = await planModel.findActiveById(planId);
  if (!plan) {
    throw ApiError.notFound('Selected plan not found or inactive', 'PLAN_NOT_FOUND');
  }

  // Cancel existing active subscription
  await subscriptionModel.cancelActive(userId);

  // Calculate period
  const startDate = new Date();
  const endDate = new Date(startDate);
  if (plan.interval === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
  else if (plan.interval === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);

  return subscriptionModel.createWithPlan({
    user_id: userId,
    plan_id: planId,
    status: extra.status || 'active',
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  });
};

const updateSubscriptionStatus = (subscriptionId, userId, status) =>
  subscriptionModel.updateStatus(subscriptionId, userId, status);

const cancelUserActiveSubscription = (userId) => subscriptionModel.cancelActive(userId);

/**
 * Check if a user has access to a specific feature.
 */
const checkUserAccess = async (userId, feature) => {
  const active = await getUserActiveSubscription(userId);

  if (!active) return feature === 'basic_features';

  // Check expiry
  if (new Date() > new Date(active.end_date)) {
    await subscriptionModel.updateStatus(active.id, userId, 'expired');
    return feature === 'basic_features';
  }

  const allowed = PLAN_FEATURES[active.plans.name] || ['basic_features'];
  return allowed.includes(feature);
};

module.exports = {
  getAllPlans,
  getPlanById,
  getUserSubscriptions,
  getUserActiveSubscription,
  createSubscription,
  updateSubscriptionStatus,
  cancelUserActiveSubscription,
  checkUserAccess,
};