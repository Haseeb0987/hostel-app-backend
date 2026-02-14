/**
 * Supabase Client Factory
 * Provides reusable anon and admin (service-role) clients.
 * Environment validation is handled by config/env.js.
 */

const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
const logger = require('../utils/logger');

const commonOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

/**
 * Public / anon client – respects RLS policies.
 */
const supabase = createClient(env.supabase.url, env.supabase.anonKey, commonOptions);

/**
 * Admin / service-role client – bypasses RLS.
 * Only available when SUPABASE_SERVICE_ROLE_KEY is set.
 */
const supabaseAdmin = env.supabase.serviceRoleKey
  ? createClient(env.supabase.url, env.supabase.serviceRoleKey, commonOptions)
  : null;

/** Lightweight connection check (runs once at startup, skipped in test). */
const testConnection = async () => {
  try {
    const { error } = await supabase.from('plans').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      logger.warn('Supabase connection warning', { error: error.message });
    } else {
      logger.info('Supabase client initialized successfully');
    }
  } catch (err) {
    logger.error('Failed to initialize Supabase client', { error: err.message });
  }
};

if (!env.isTest) {
  testConnection();
}

module.exports = { supabase, supabaseAdmin };