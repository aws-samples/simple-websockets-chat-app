// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-route-keys-connect-disconnect.html
// The $disconnect route is executed after the connection is closed.
// The connection can be closed by the server or by the client. As the connection is already closed when it is executed,
// $disconnect is a best-effort event.
// API Gateway will try its best to deliver the $disconnect event to your integration, but it cannot guarantee delivery.
const { removeConnectionIdFromAllRooms } = require('../api/room');

module.exports = async (event) => {
  const { connectionId } = event.requestContext;
  await removeConnectionIdFromAllRooms(connectionId);
  return { statusCode: 200, body: "Disconnected." };
};
