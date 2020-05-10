const { saveConnectionInRoom, getConnectionIdsByRoomId } = require("../api/room");
const { buildEvent, emitEvent, EventTypes } = require("../api/event");

module.exports = async event => {
  const roomId = event.queryStringParameters.j;
  const connectionId = event.requestContext.connectionId;
  await saveConnectionInRoom(connectionId, roomId);

  const connectionIds = await getConnectionIdsByRoomId(roomId);
  const connectionsCount = connectionIds.length;
  const eventType = EventTypes.CONNECTIONS_COUNT_CHANGED;
  const data = { roomId, connectionsCount };
  const systemEvent = buildEvent(eventType, data);
  await emitEvent(event.requestContext, systemEvent, connectionIds);

  return { statusCode: 200, body: "Connected." };
};
