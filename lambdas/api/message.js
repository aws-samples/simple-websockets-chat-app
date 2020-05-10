const { getConnectionIdsByRoomId, removeConnectionIdsFromAllRooms } = require('./room')
const { createBatch, trackBatch } = require('./eventTracker')
const { buildEvent, emitEvent, EventTypes } = require('./event')

exports.buildMessage = ({ id, roomId, authorId, text, createdAt }) => {
  const data = { id, roomId, authorId, text, createdAt };
  return buildEvent(EventTypes.MESSAGE_SENT, data);
}

exports.broadcastMessageInRoom = async (requestContext, systemEvent, roomId) => {
  const { connectionId } = requestContext;
  const connectionIds = (await getConnectionIdsByRoomId(roomId))
    .filter(id => id != connectionId);

  if (!connectionIds.length) {
    return;
  }

  const result = await emitEvent(requestContext, systemEvent, connectionIds);
  return handleEmitEventResult(result);
}

exports.broadcastConnectionsCountChangedInRoom = async (requestContext, roomId) => {
  const connectionIds = await getConnectionIdsByRoomId(roomId);
  const connectionsCount = connectionIds.length;
  const eventType = EventTypes.CONNECTIONS_COUNT_CHANGED;
  const data = { roomId, connectionsCount };
  const systemEvent = buildEvent(eventType, data);
  await emitEvent(requestContext, systemEvent, connectionIds);
}

const handleEmitEventResult = async ({ successful, staled }) => {
  const batch = createBatch()
  successful.map(message => batch.pushEvent(EventTypes.MESSAGE_SENT, message))
  await trackBatch(batch);

  const connectionIds = staled.map(({ ConnectionId}) => ConnectionId);
  await removeConnectionIdsFromAllRooms(connectionIds);
}
