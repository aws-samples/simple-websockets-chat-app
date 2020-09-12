const { error } = require('../helpers/log').buildLogger('API/EVENT');
const fail = require('../helpers/fail')(error);
const buildClient = require('./transport');

const EventTypes = {
  CONNECTIONS_COUNT_CHANGED: 'CONNECTIONS_COUNT_CHANGED',
  CONNECTION_CONNECTED: 'CONNECTION_CONNECTED',
  CONNECTION_DISCONNECTED: 'CONNECTION_DISCONNECTED',
  MESSAGE_SENT: 'MESSAGE_SENT',
  MESSAGE_BATCH_SENT: 'MESSAGE_BATCH_SENT',
  MESSAGE_REPLY_SENT: 'MESSAGE_REPLY_SENT',
  MESSAGE_REACTION_SENT: 'MESSAGE_REACTION_SENT',
  MESSAGE_DELETED: 'MESSAGE_DELETED',
  ROOM_JOINED: 'ROOM_JOINED',
  ROOM_LEFT: 'ROOM_LEFT'
};
exports.EventTypes = EventTypes;

const throwErrorIfInvalidEventType = eventType => {
  if (!EventTypes.hasOwnProperty(eventType)) {
    fail('Unsupported event type: ' + eventType);
  }
}

exports.throwErrorIfInvalidEventType = throwErrorIfInvalidEventType

exports.buildEvent = (e, data) => {
  throwErrorIfInvalidEventType(e);
  const ts = new Date().getTime();
  const meta = { e, ts };
  return { meta, data };
}

exports.emitEvent = (requestContext, event, targets) => {
  const Data = JSON.stringify(event);
  const messages = targets.map(ConnectionId => ({ ConnectionId, Data }));
  return postToConnections(buildClient(requestContext), messages);
}

const postToConnections = async (client, messages) => {
  const successful = [];
  const staled = [];
  const promises = messages.map(message => client
    .postToConnection(message)
    .promise()
    .then(() => successful.push(message))
    .catch(error => {
      if (error.statusCode !== 410) {
        throw error
      }
      staled.push(message)
    })
  );

  await Promise.all(promises);
  return { successful, staled };
}
