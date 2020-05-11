const { DEBUG_MODE } = process.env;

module.exports = (...args) => DEBUG_MODE && console.log(...args);
