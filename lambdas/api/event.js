const AWS = require("aws-sdk");

const EventTypes = {
  CONNECTION_CONNECTED: 'CONNECTION_CONNECTED',
  CONNECTION_DISCONNECTED: 'CONNECTION_DISCONNECTED',
  MESSAGE_SENT: 'MESSAGE_SENT',
  ROOM_JOINED: 'ROOM_JOINED',
  ROOM_LEFT: 'ROOM_LEFT'
};
exports.EventTypes = EventTypes;

const throwErrorIfInvalidEventType = eventType => {
  if (!EventTypes.hasOwnProperty(eventType)) {
    throw new Error('Unsupported event type: ' + e);
  }
}
exports.throwErrorIfInvalidEventType = throwErrorIfInvalidEventType

exports.buildEvent = (e, data) => {
  throwErrorIfInvalidEventType(e);
  const ts = new Date().getTime();
  const meta = { e, ts };
  return { meta, data };
}

const buildApiGatewayManagementApiClient = ({ domainName, stage }) => {
  return new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: domainName + "/" + stage,
  });
}

exports.emitEvent = (requestContext, event, targets) => {
  const Data = JSON.stringify(event);
  const messages = targets.map(ConnectionId => ({ ConnectionId, Data }));
  const client = buildApiGatewayManagementApiClient(requestContext);
  return postToConnections(client, messages);
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
