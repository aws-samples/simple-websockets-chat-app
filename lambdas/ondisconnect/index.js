const { removeConnectionIdsFromAllRooms } = require('../api/room');
const { broadcastConnectionsCountChangedInRoom } = require('../api/message')

module.exports = async (event) => {
  const { connectionId } = event.requestContext;
  const keys = await removeConnectionIdsFromAllRooms([connectionId]);
  await Promise.all(keys.map(({ roomId }) => {
    return broadcastConnectionsCountChangedInRoom(event.requestContext, roomId)
  }));
  return { statusCode: 200, body: "Disconnected." };
};
