const { logLevel } = require('./config');

const DEBUG = 'DEBUG'
const INFO = 'INFO'
const WARN = 'WARN'
const getPriority = level => [DEBUG, INFO, WARN].indexOf(level);
const isLevelOn = level => getPriority(level) >= getPriority(logLevel);

const DEBUG_ON = isLevelOn(DEBUG);
const INFO_ON = isLevelOn(INFO);
const LOG_ON = isLevelOn(INFO);
const WARN_ON = isLevelOn(WARN);
const ERROR_ON = true;

const prepend = (prefix, args) => {
  if (!prefix) return args;

  let pre = Array.isArray(prefix) ? prefix : [prefix];
  return pre.concat(args);
};

const buildLogger = prefix => ({
  debug: (...args) => DEBUG_ON && console.debug(...prepend(prefix, args)),
  log: (...args) => LOG_ON && console.log(...prepend(prefix, args)),
  info: (...args) => INFO_ON && console.log(...prepend(prefix, args)),
  warn: (...args) => WARN_ON && console.warn(...prepend(prefix, args)),
  error: (...args) => ERROR_ON && console.error(...prepend(prefix, args)),
  buildLogger: (newPrefix) => buildLogger(prefix ? [newPrefix, prefix] : [newPrefix])
})

module.exports = buildLogger();
