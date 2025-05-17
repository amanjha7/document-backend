// logger.js

const fs = require('fs');
const path = require('path');

// Log file path
const logDir = path.join(__dirname, 'logs');
const logFile = path.join(logDir, 'app.log');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Format timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

// Log message to console and file
const writeLog = (level, message) => {
  const logMessage = `[${getTimestamp()}] [${level.toUpperCase()}]: ${message}`;

  // Output to console
  if (level === 'error') {
    console.error(logMessage);
  } else if (level === 'warn') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }

  // Append to log file
  fs.appendFileSync(logFile, logMessage + '\n', 'utf8');
};

// Export logger object
const logger = {
  info: (msg) => writeLog('info', msg),
  warn: (msg) => writeLog('warn', msg),
  error: (msg) => writeLog('error', msg),
};

module.exports = logger;
