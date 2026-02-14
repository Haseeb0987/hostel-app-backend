/**
 * Logger Utility
 * Structured logging with level support.
 * Replace with winston/pino in production for JSON log output.
 */

const env = process.env.NODE_ENV || 'development';
const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = env === 'production' ? LOG_LEVELS.info : LOG_LEVELS.debug;

const timestamp = () => new Date().toISOString();

const logger = {
  error(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.error) {
      console.error(JSON.stringify({ level: 'error', timestamp: timestamp(), message, ...meta }));
    }
  },

  warn(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.warn) {
      console.warn(JSON.stringify({ level: 'warn', timestamp: timestamp(), message, ...meta }));
    }
  },

  info(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.info) {
      console.log(JSON.stringify({ level: 'info', timestamp: timestamp(), message, ...meta }));
    }
  },

  debug(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.debug) {
      console.log(JSON.stringify({ level: 'debug', timestamp: timestamp(), message, ...meta }));
    }
  },
};

module.exports = logger;
