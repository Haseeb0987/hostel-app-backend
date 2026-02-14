/**
 * Base Model
 * Generic CRUD abstraction over a Supabase table.
 * Extend this class per-table to keep DB logic out of services.
 */

const { supabase } = require('../config/supabase');

class BaseModel {
  /**
   * @param {string} tableName - Supabase table name
   */
  constructor(tableName) {
    this.table = tableName;
    this.db = supabase;
  }

  /**
   * Find multiple rows.
   * @param {object} [options]
   * @param {object} [options.filters]  - Key-value equality filters
   * @param {string} [options.select]   - Column selection string
   * @param {object} [options.order]    - { column, ascending }
   * @param {number} [options.limit]
   * @returns {Promise<Array>}
   */
  async findMany({ filters = {}, select = '*', order = null, limit = null } = {}) {
    let query = this.db.from(this.table).select(select);

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
    if (order) {
      query = query.order(order.column, { ascending: order.ascending ?? true });
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Find a single row by filters.
   * @param {object} filters
   * @param {string} [select]
   * @returns {Promise<object|null>}
   */
  async findOne(filters, select = '*') {
    const rows = await this.findMany({ filters, select, limit: 1 });
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find by primary key (id).
   * @param {string} id
   * @param {string} [select]
   * @returns {Promise<object|null>}
   */
  async findById(id, select = '*') {
    return this.findOne({ id }, select);
  }

  /**
   * Insert a row and return it.
   * @param {object} data
   * @param {string} [select]
   * @returns {Promise<object>}
   */
  async create(data, select = '*') {
    const { data: result, error } = await this.db
      .from(this.table)
      .insert([data])
      .select(select)
      .single();

    if (error) throw error;
    return result;
  }

  /**
   * Update rows matching filters.
   * @param {object} filters
   * @param {object} updates
   * @param {string} [select]
   * @returns {Promise<Array>}
   */
  async update(filters, updates, select = '*') {
    let query = this.db.from(this.table).update(updates);

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query.select(select);
    if (error) throw error;
    return data;
  }

  /**
   * Delete rows matching filters. Returns deleted rows.
   * @param {object} filters
   * @returns {Promise<Array>}
   */
  async delete(filters) {
    let query = this.db.from(this.table).delete();

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query.select();
    if (error) throw error;
    return data;
  }
}

module.exports = BaseModel;
