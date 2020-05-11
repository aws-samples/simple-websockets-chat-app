const { put, queryTable, queryIndex, removeKeys } = require('./storage')
const { trackEvent, createBatch, trackBatch } = require('./eventTracker')
const {
  CONNECTIONS_TABLE_NAME: tableName,
  CONNECTIONS_TABLE_TTL_HOURS: ttlHours,
  ROOM_ID_INDEX: indexName,
} = process.env;

const buildRecord = (connectionId, roomId) {
  const ttl = new Date().getTime() + 1000 * 60 * 60 * ttlHours;
  return { connectionId, roomId, ttl };
}

const save = async (connectionId, roomId) => {
  const record = buildRecord(connectionId, roomId);
  await put(tableName, record);
  const eventType = roomId && roomId.length ? 'joined' : 'connected';
  await trackEvent(eventType, record);
}
exports.saveConnection = save
exports.saveConnectionInRoom = save

const getRoomsByConnectionId = async connectionId => {
  const { Items } = await queryTable(tableName, 'connectionId', connectionId);
  return Items;
};

exports.removeConnectionIdsFromAllRooms = async connectionIds => {
  const roomsResults = await Promise.all(connectionIds.map(getRoomsByConnectionId));
  const keys = connectionIds.map(connectionId => { connectionId })
  roomsResults.forEach(result => result.forEach(
    ({ connectionId, roomId }) => keys.push({ connectionId, roomId })
  ));
  await removeKeys(tableName, keys);

  const batch = createBatch();
  keys.map(key => {
    const eventType = key.roomId && key.roomId.length ? 'left' : 'disconnected';
    batch.pushEvent(eventType, key)
  })
  await trackBatch(batch);
  return keys;
}

exports.getConnectionIdsByRoomId = async roomId => {
  const { Items } = await queryIndex(
    tableName,
    indexName,
    'roomId',
    roomId
  );
  return Items.map(({ connectionId }) => connectionId);
}
