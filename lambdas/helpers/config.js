const {
  LOG_LEVEL,
  ENVIRONMENT,
} = process.env;

exports.logLevel = LOG_LEVEL;
exports.isProduction = ENVIRONMENT === 'production'
exports.isDevelopment = ENVIRONMENT === 'development'
exports.isStaging = ENVIRONMENT === 'staging'
