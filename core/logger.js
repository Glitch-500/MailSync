/**
 * MailSync Safe Logger
 * Serverless-compatible logger that logs to stdout/stderr and maintains
 * an in-memory ring buffer for the /logs diagnostic endpoint.
 */

const MAX_LOGS = 100;
const memoryLogs = [];

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${typeof message === "object" ? JSON.stringify(message) : message}`;
}

function pushLog(formatted) {
  memoryLogs.push(formatted);
  if (memoryLogs.length > MAX_LOGS) {
    memoryLogs.shift();
  }
}

const logger = {
  info: (message) => {
    const formatted = formatMessage("info", message);
    console.log(formatted);
    pushLog(formatted);
  },
  warn: (message) => {
    const formatted = formatMessage("warn", message);
    console.warn(formatted);
    pushLog(formatted);
  },
  error: (message) => {
    const formatted = formatMessage("error", message);
    console.error(formatted);
    pushLog(formatted);
  },
  debug: (message) => {
    if (process.env.DEBUG || process.env.NODE_ENV === "development") {
      const formatted = formatMessage("debug", message);
      console.debug(formatted);
      pushLog(formatted);
    }
  },
  getRecentLogs: () => {
    return [...memoryLogs];
  },
};

module.exports = logger;
