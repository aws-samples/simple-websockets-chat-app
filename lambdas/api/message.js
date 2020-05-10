const { getConnectionIdsByRoomId, removeConnectionIdsFromAllRooms } = require('./room')
const { createBatch, trackBatch } = require('./eventTracker')
const { buildEvent, emitEvent, EventTypes } = require('./event')

exports.buildMessage = ({ id, roomId, authorId, text, createdAt }) => {
  const data = { id, roomId, authorId, text, createdAt };
  return buildEvent(EventTypes.MESSAGE_SENT, data);
}

exports.broadcastMessageInRoom = async (requestContext, event, roomId) => {
  const { connectionId } = requestContext;
  const connectionIds = (await getConnectionIdsByRoomId(roomId))
    .filter(id => id != connectionId);

  if (!connectionIds.length) {
    return;
  }

  const result = await emitEvent(requestContext, event, connectionIds);
  return handleBroadcastMessagesResult(result);
}

const handleBroadcastMessagesResult = async ({ successful, staled }) => {
  const batch = createBatch()
  successful.map(message => batch.pushEvent(EventTypes.MESSAGE_SENT, message))
  await trackBatch(batch);

  const connectionIds = staled.map(({ ConnectionId}) => ConnectionId);
  await removeConnectionIdsFromAllRooms(connectionIds);
}
