const { connectionIdsByRoomId } = require('./storage')
const { createBatch, trackBatch } = require('./eventTracker')
const { buildEvent, emitEvent, EventTypes } = require('./event')

const buildMessageSentEvent = ({ messageId, roomId, authorId, text, createdAt }) => {
  const data = { messageId, roomId, authorId, text, createdAt };
  return buildEvent(EventTypes.MESSAGE_SENT, data);
}

exports.broadcastMessageInRoom = async (requestContext, message) => {
  const { connectionId } = requestContext;
  const { roomId } = message;
  const connectionIds = (await connectionIdsByRoomId(roomId))
    .filter(id => id != connectionId);

  if (!connectionIds.length) {
    return;
  }

  const systemEvent = buildMessageSentEvent(message);
  const { successful } = await emitEvent(requestContext, systemEvent, connectionIds);

  const batch = createBatch()
  successful.map(message => batch.pushEvent(EventTypes.MESSAGE_SENT, message))
  await trackBatch(batch);
}

const broadcastConnectionsCountChangedInRooms = (requestContext, roomIds) => {
  return Promise.all(roomIds.map(roomId => {
    return broadcastConnectionsCountChangedInRoom(requestContext, roomId)
  }));
}
exports.broadcastConnectionsCountChangedInRooms = broadcastConnectionsCountChangedInRooms;

const broadcastConnectionsCountChangedInRoom = async (requestContext, roomId) => {
  const connectionIds = await connectionIdsByRoomId(roomId);
  const connectionsCount = connectionIds.length;
  if (!connectionsCount) {
    return;
  }

  const eventType = EventTypes.CONNECTIONS_COUNT_CHANGED;
  const data = { roomId, connectionsCount };
  const systemEvent = buildEvent(eventType, data);
  await emitEvent(requestContext, systemEvent, connectionIds);
}
exports.broadcastConnectionsCountChangedInRoom = broadcastConnectionsCountChangedInRoom;
