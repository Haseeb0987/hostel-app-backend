/**
 * Environment Configuration
 * Centralizes and validates all environment variables.
 * Fail-fast on missing required vars at startup.
 */

require('dotenv').config();

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || null,
  },

  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
      : ['http://localhost:3000', 'http://localhost:3001'],
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Helpers
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isTest: (process.env.NODE_ENV || 'development') === 'test',
};

module.exports = env;
