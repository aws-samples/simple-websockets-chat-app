const { removeConnectionIdFromAllRooms } = require('../api/room');

module.exports = async (event) => {
  const { connectionId } = event.requestContext;
  await removeConnectionIdFromAllRooms(connectionId);
  return { statusCode: 200, body: "Disconnected." };
};
