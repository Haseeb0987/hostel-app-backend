/**
 * Route Index
 * Aggregates all route modules and mounts them under their prefixes.
 * Keeps app.js clean.
 */

const express = require('express');
const router = express.Router();

const systemRoutes = require('./systemRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');

// System-level (no /api prefix)
router.use('/', systemRoutes);

// API routes
router.use('/api/auth', authRoutes);
router.use('/api/user', userRoutes);
router.use('/api/subscriptions', subscriptionRoutes);

module.exports = router;
