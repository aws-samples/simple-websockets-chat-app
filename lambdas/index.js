import connect from './onconnect'
import disconnect from './ondisconnect'
import sendmessage from './sendmessage'

const handlers = {
  "$connect": connect,
  "$disconnect": disconnect,
  "sendmessage": sendmessage
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
