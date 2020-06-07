const { error: defaultLogger } = require('./log')

module.exports = (error = defaultLogger) => (reason, e) => {
  error(`Fail reason: ` + reason)
  if (!e) {
    e = new Error(reason)
  }

  throw e;
}
