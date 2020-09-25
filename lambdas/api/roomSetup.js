const { queryRoomSetup, putRoomSetup } = require('./storage');
const { EventTypes } = require('./event');

exports.loadRoomSetupInfo = async roomId => {
  const [info] = await queryRoomSetup(roomId)
  return info
}

exports.updateRoomSetupInfo = async (roomId, info) => {
  await putRoomSetup({
    roomId,
    ...info
  });

  return info;
}
