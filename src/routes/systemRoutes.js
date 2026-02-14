/**
 * System Routes
 * Health check & welcome endpoints (moved out of app.js).
 */

const express = require('express');
const router = express.Router();
const ApiResponse = require('../utils/ApiResponse');
const env = require('../config/env');

/** GET /health */
router.get('/health', (_req, res) => {
  ApiResponse.success(res, {
    message: 'Server is running',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv,
    },
  });
});

/** GET / */
router.get('/', (_req, res) => {
  ApiResponse.success(res, {
    message: 'Welcome to Node.js + Express + Supabase Backend API',
    data: {
      version: '1.0.0',
      documentation: '/api/docs',
    },
  });
});

module.exports = router;
