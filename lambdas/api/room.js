const { put } = require('./storage')
const { trackEvent } = require('./eventTracker')
const { TABLE_NAME } = process.env;

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
