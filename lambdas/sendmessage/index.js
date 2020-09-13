const { info, error } = require('../helpers/log').buildLogger('HANDLER/SEND_MESSAGE');
const { joinRoom, leaveRoom } = require('../api/room')
const { saveMessage, broadcastEventInRoom, latestMessagesInRoom, sendLatestMessages } = require('../api/message')
const { buildEvent, EventTypes, emitEvent } = require('../api/event')

const handleJoinRoom = async (lambdaEvent, systemEvent) => {
  const { roomId } = systemEvent.data;
  if (!roomId || !roomId.length) return;

  await joinRoom(lambdaEvent.requestContext, roomId);
  const messages = await latestMessagesInRoom(roomId);
  const messagesSystemEvent = buildEvent(
    EventTypes.MESSAGE_BATCH_SENT,
    { roomId, messages }
  );
  return emitEvent(lambdaEvent.requestContext, messagesSystemEvent, [
    lambdaEvent.requestContext.connectionId
  ]);
}

const handleLeaveRoom = (lambdaEvent, systemEvent) => {
  const { roomId } = systemEvent.data;
  return leaveRoom(lambdaEvent.requestContext, roomId);
}

const handleEventInRoom = async (lambdaEvent, systemEvent) => {
  console.log(systemEvent)
  await saveMessage(lambdaEvent.requestContext, systemEvent);
  return broadcastEventInRoom(lambdaEvent.requestContext, systemEvent);
}

const handlers = {
  [EventTypes.ROOM_JOINED]: handleJoinRoom,
  [EventTypes.ROOM_LEFT]: handleLeaveRoom,
  [EventTypes.MESSAGE_SENT]: handleEventInRoom,
  [EventTypes.MESSAGE_REPLY_SENT]: handleEventInRoom,
  [EventTypes.MESSAGE_REACTION_SENT]: handleEventInRoom,
  [EventTypes.MESSAGE_DELETED]: handleEventInRoom,
};

module.exports = async event => {
  try {
    const { body, requestContext } = event;
    const receivedEvent = JSON.parse(JSON.parse(body).data);
    const eventType = receivedEvent.meta.e;
    const handler = handlers[eventType];
    info(`Got event type "${eventType}"`);
    await handler(event, receivedEvent);
    info(`Handled event type "${eventType}"`);
    return { statusCode: 200, body: `Event ${eventType} handled.` };
  } catch (e) {
    error(`Error handling message: ` + e.message);
    throw e;
  }
};
