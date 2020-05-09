const handlers = {
  "$connect": require('./onconnect'),
  "$disconnect": require('./ondisconnect'),
  "sendmessage": require('./sendmessage')
}

exports.handler = async (event) => {
  const route = event.requestContext.routeKey;
  const handler = handlers[route]
  try {
    return handler(event)
  } catch(error) {
    const message = error.message || error
    console.error(`Error handling ${route}: ` + message)
    console.error(error.stack)
    return { statusCode: 500, body: message }
  }
}
