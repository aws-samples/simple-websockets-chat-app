const { put, queryIndex, removeKeys } = require('./storage')
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

const getRoomsForConnectionId = async connectionId => {
  const { Items } = await queryIndex(
    TABLE_NAME,
    CONNECTION_ID_INDEX,
    'connectionId',
    connectionId
  );
  return Items;
};

exports.removeConnectionIdFromAllRooms = async connectionId => {
  try {
    const rooms = await getRoomsForConnectionId(connectionId);
    const keys = rooms.map(({ roomId, connectionId }) => ({ roomId, connectionId }));
    await removeKeys(TABLE_NAME, keys);
    const batch = createBatch();
    keys.map(key => batch.pushEvent('left', key))
    await trackBatch(batch);
  } catch (error) {
    await trackEvent('error-leaving', { connectionId, errorMessage: error.message })
    throw error;
  }
}
