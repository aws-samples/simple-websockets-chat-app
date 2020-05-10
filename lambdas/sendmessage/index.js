const { broadcastMessageInRoom, buildMessage } = require('../api/message')

const handleMessageSent = async (lambdaEvent, systemEvent) => {
  const { messageId, roomId, authorId, text, createdAt } = systemEvent.data;

  const message = buildMessage({ messageId, roomId, authorId, text, createdAt });
  await broadcastMessageInRoom(lambdaEventEvent.requestContext, message, roomId);
}

const handlers = {
  [EventTypes.MESSAGE_SENT]: handleMessageSent
};

module.exports = async event => {
  const { body, requestContext } = event;
  const receivedEvent = JSON.parse(JSON.parse(body).data);
  const eventType = receivedEvent.meta.e;
  const handler = handlers[eventType]
  await handler(event, receivedEvent);

  return { statusCode: 200, body: `Event ${eventType} handled.` };
};
