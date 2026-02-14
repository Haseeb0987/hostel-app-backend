/**
 * Express Application Setup
 * Configures middleware pipeline, routes, and error handling.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// ── Security ──
app.use(helmet());
app.use(cors({ origin: env.cors.origins, credentials: true }));

// ── Rate Limiting ──
app.use(
  '/api',
  rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    message: { success: false, message: 'Too many requests, please try again later.', data: null, error: { code: 'RATE_LIMIT_EXCEEDED' } },
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// ── Logging ──
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── API Documentation ──
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
  swaggerOptions: { persistAuthorization: true },
}));
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// ── Routes ──
app.use(routes);

// ── Error Handling (must be last) ──
app.use(notFound);
app.use(errorHandler);

module.exports = app;