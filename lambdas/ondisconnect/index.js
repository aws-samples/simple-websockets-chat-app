const { leaveAllRooms } = require('../api/room');
const { removeConnection } = require('../api/connection');
const { broadcastConnectionsCountChangedInRooms } = require('../api/message');

module.exports = async event => {
  const { requestContext } = event;
  await leaveAllRooms(requestContext);
  await removeConnection(requestContext.connectionId);
  return { statusCode: 200, body: "Disconnected." };
};
