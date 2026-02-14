/**
 * Plan Model
 * Abstraction for the `plans` table.
 */

const BaseModel = require('./base.model');

class PlanModel extends BaseModel {
  constructor() {
    super('plans');
  }

  /** Column selection for public-facing plan data. */
  static get PUBLIC_COLUMNS() {
    return 'id, name, description, price, currency, interval, is_active, created_at';
  }

  /**
   * Get all active plans ordered by price.
   * @returns {Promise<Array>}
   */
  async findAllActive() {
    return this.findMany({
      filters: { is_active: true },
      select: PlanModel.PUBLIC_COLUMNS,
      order: { column: 'price', ascending: true },
    });
  }

  /**
   * Find an active plan by ID.
   * @param {string} planId
   * @returns {Promise<object|null>}
   */
  async findActiveById(planId) {
    return this.findOne({ id: planId, is_active: true }, PlanModel.PUBLIC_COLUMNS);
  }
}

module.exports = new PlanModel();
