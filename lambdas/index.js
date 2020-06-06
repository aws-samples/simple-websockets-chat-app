const { error } = require('./helpers/log').buildLogger('INDEX')
const handlers = {
  "$connect": require('./onconnect'),
  "$disconnect": require('./ondisconnect'),
  "sendmessage": require('./sendmessage')
}

const getHandler = (event) => {
  try {
    return handlers[event.requestContext.routeKey]
  } catch(error) {
    throw new Error(`Didn't find handler: ` + error.message);
  }
}

exports.handler = (event) => {
  try {
    return getHandler(event)(event)
  } catch({ message }) {
    error(`Got error: ${message}. Sending HTTP 500`);
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
