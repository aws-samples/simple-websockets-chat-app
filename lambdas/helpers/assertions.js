const { error: defaultLogger } = require('./log');

module.exports = (error = defaultLogger) => {
  const fail = require('./fail')(error)
  const isEmpty = value => value === null || value === undefined || !value.length;
  return {
    assertNotEmpty: (...args) => args.forEach((value, i) => {
      if (isEmpty(value)) {
        fail(`Required value at ${i} is empty`);
      }
    }),
    assertNoEmptyProperties: object => Object.keys(object).forEach(property => {
      if (isEmpty(object[property])) {
        fail(`Required property ${property} is empty`);
      }
    }),
  }
}
