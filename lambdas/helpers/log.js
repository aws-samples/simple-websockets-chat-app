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

exports.debug = (...args) => DEBUG_ON && console.debug(...args)
exports.log = (...args) => LOG_ON && console.log(...args)
exports.info = (...args) => INFO_ON && console.log(...args)
exports.warn = (...args) => WARN_ON && console.warn(...args)
exports.error = (...args) => ERROR_ON && console.error(...args)
