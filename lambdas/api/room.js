const { put, queryTable, queryIndex, removeKeys } = require('./storage')
const { trackEvent, createBatch, trackBatch } = require('./eventTracker')
const { TABLE_NAME, CONNECTION_ID_INDEX } = process.env;

exports.saveConnectionInRoom = async (connectionId, roomId) => {
  const record = { connectionId, roomId };
  try {
    await put(TABLE_NAME, record);
    await trackEvent('joined', record);
  } catch(error) {
    await trackEvent('error-joining', { ...record, errorMessage: error.message })
    throw error
  }
}

const getRoomsByConnectionId = async connectionId => {
  const { Items } = await queryIndex(
    TABLE_NAME,
    CONNECTION_ID_INDEX,
    'connectionId',
    connectionId
  );
  return Items;
};

exports.removeConnectionIdsFromAllRooms = async connectionIds => {
  const roomsResults = await Promise.all(connectionIds.map(getRoomsByConnectionId));
  const keys = []
  roomsResults.forEach(result => result.forEach(({roomId, connectionId}) => keys.push({ roomId, connectionId })));
  await removeKeys(TABLE_NAME, keys);
  const batch = createBatch();
  keys.map(key => batch.pushEvent('left', key))
  await trackBatch(batch);
  return keys;
}

exports.getConnectionIdsByRoomId = async roomId => {
  const { Items } = await queryTable(TABLE_NAME, 'roomId', roomId);
  return Items.map(({ connectionId }) => connectionId);
}
