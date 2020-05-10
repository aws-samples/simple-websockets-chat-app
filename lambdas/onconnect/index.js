const { saveConnectionInRoom, getConnectionIdsByRoomId } = require("../api/room");
const { broadcastConnectionsCountChangedInRoom } = require("../api/message");

module.exports = async event => {
  const roomId = event.queryStringParameters.j;
  const connectionId = event.requestContext.connectionId;

  await saveConnectionInRoom(connectionId, roomId);
  await broadcastConnectionsCountChangedInRoom(event.requestContext, roomId);

  return { statusCode: 200, body: "Connected." };
};
