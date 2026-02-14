/**
 * Subscription Model
 * Abstraction for the `subscriptions` table.
 */

const BaseModel = require('./base.model');

/** Joined select used for subscription + plan queries. */
const SUBSCRIPTION_WITH_PLAN = `
  *,
  plans (
    id,
    name,
    description,
    price,
    currency,
    interval
  )
`;

class SubscriptionModel extends BaseModel {
  constructor() {
    super('subscriptions');
  }

  /**
   * Get all subscriptions for a user, newest first, including plan data.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async findByUser(userId) {
    const { data, error } = await this.db
      .from(this.table)
      .select(SUBSCRIPTION_WITH_PLAN)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get the latest active subscription for a user.
   * @param {string} userId
   * @returns {Promise<object|null>}
   */
  async findActiveByUser(userId) {
    const { data, error } = await this.db
      .from(this.table)
      .select(SUBSCRIPTION_WITH_PLAN)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  }

  /**
   * Create a subscription and return it with plan data.
   * @param {object} subscription
   * @returns {Promise<object>}
   */
  async createWithPlan(subscription) {
    const { data, error } = await this.db
      .from(this.table)
      .insert([subscription])
      .select(SUBSCRIPTION_WITH_PLAN)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a subscription status, scoped to the owning user.
   * @param {string} subscriptionId
   * @param {string} userId
   * @param {string} status
   * @returns {Promise<object|null>}
   */
  async updateStatus(subscriptionId, userId, status) {
    const { data, error } = await this.db
      .from(this.table)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', subscriptionId)
      .eq('user_id', userId)
      .select(SUBSCRIPTION_WITH_PLAN);

    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  }

  /**
   * Cancel (set status = 'canceled') all active subscriptions for a user.
   * @param {string} userId
   * @returns {Promise<object|null>} The cancelled subscription, or null if none existed.
   */
  async cancelActive(userId) {
    const { data, error } = await this.db
      .from(this.table)
      .update({ status: 'canceled', updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('status', 'active')
      .select(SUBSCRIPTION_WITH_PLAN);

    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  }
}

module.exports = new SubscriptionModel();
