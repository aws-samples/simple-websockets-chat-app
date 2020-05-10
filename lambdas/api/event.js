const AWS = require("aws-sdk");

const EventTypes = {
  CONNECTIONS_COUNT_CHANGED: 'CONNECTIONS_COUNT_CHANGED',
  MESSAGE_SENT: 'MESSAGE_SENT',
  CONNETION_JOINED: 'CONNETION_JOINED',
  CONNETION_LEFT: 'CONNETION_LEFT'
};
exports.EventTypes = EventTypes;

exports.buildEvent = (e, data) => {
  if (!EventTypes.hasOwnProperty(e)) {
    throw new Error('Unsupported event type: ' + e);
  }
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
