/**
 * Server Entry Point
 * Initializes and starts the Express server.
 */

const env = require('./config/env'); // loads dotenv internally
const app = require('./app');
const logger = require('./utils/logger');

const server = app.listen(env.port, () => {
  logger.info(`Server started`, { port: env.port, env: env.nodeEnv, url: `http://localhost:${env.port}` });
});

// ── Graceful shutdown ──
const shutdown = (signal) => {
  logger.info(`${signal} received – shutting down gracefully`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Catch unhandled rejections so they don't crash the process silently
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: reason?.message || reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception – exiting', { error: err.message, stack: err.stack });
  process.exit(1);
});