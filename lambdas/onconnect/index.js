const { saveConnectionInRoom } = require("../api/room");

module.exports = async event => {
  const roomId = event.queryStringParameters.j;
  const connectionId = event.requestContext.connectionId;
  await saveConnectionInRoom(connectionId, roomId);

  return { statusCode: 200, body: "Connected." };
};
