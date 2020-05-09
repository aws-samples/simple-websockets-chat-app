const { put } = require('./storage')

const { TABLE_NAME } = process.env;

exports.saveConnectionInRoom = (connectionId, roomId) => {
    return put(TABLE_NAME, { connectionId, roomId });
}
