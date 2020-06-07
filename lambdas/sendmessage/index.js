const { info, error } = require('../helpers/log').buildLogger('HANDLER/SEND_MESSAGE');
const { joinRoom, leaveRoom } = require('../api/room')
const { broadcastEventInRoom } = require('../api/message')
const { EventTypes } = require('../api/event')

const handleJoinRoom = (lambdaEvent, systemEvent) => {
  const { roomId } = systemEvent.data;
  return joinRoom(lambdaEvent.requestContext, roomId);
}

const handleLeaveRoom = (lambdaEvent, systemEvent) => {
  const { roomId } = systemEvent.data;
  return leaveRoom(lambdaEvent.requestContext, roomId);
}

const handleEventInRoom = (lambdaEvent, systemEvent) => {
  return broadcastEventInRoom(lambdaEvent.requestContext, systemEvent);
}

const handlers = {
  [EventTypes.ROOM_JOINED]: handleJoinRoom,
  [EventTypes.ROOM_LEFT]: handleLeaveRoom,
  [EventTypes.MESSAGE_SENT]: handleEventInRoom,
  [EventTypes.MESSAGE_REPLY_SENT]: handleEventInRoom,
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
