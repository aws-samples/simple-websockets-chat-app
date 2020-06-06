const { debug, error } = require('../helpers/log').buildLogger('API/MESSAGE');
const fail = require('../helpers/fail')(error)
const { connectionIdsByRoomId } = require('./storage')
const { createBatch, trackBatch } = require('./eventTracker')
const { buildEvent, emitEvent, EventTypes } = require('./event')

const cleanupEvent = ({ meta, data }) => {
  switch (meta.e) {
    case EventTypes.MESSAGE_SENT: {
      const { messageId, roomId, authorId, text, createdAt } = data;
      return { meta, data: { messageId, roomId, authorId, text, createdAt } };
    }
    case EventTypes.MESSAGE_DELETED: {
      const { messageId, roomId } = data;
      return { meta, data: { messageId, roomId } };
    }
    default:
      fail(`Invalid message event type: ` + systemEvent.meta.e);
  }
}

const broadcastEventInRoom = async (requestContext, systemEvent) => {
  const messageEvent = cleanupEvent(systemEvent);
  const connectionIds = (await connectionIdsByRoomId(messageEvent.data.roomId))
    .filter(id => id != requestContext.connectionId);
  if (!connectionIds.length) {
    return;
  }
  const { successful } = await emitEvent(requestContext, messageEvent, connectionIds);

  const batch = createBatch()
  successful.map(message => batch.pushEvent(EventTypes.MESSAGE_SENT, message))
  await trackBatch(batch);
}
exports.broadcastEventInRoom = broadcastEventInRoom

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
