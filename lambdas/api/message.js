const AWS = require("aws-sdk");
const { getConnectionIdsByRoomId, removeConnectionIdsFromAllRooms } = require('./room')
const { createBatch, trackBatch } = require('./eventTracker')

const buildApiGatewayManagementApiClient = ({ domainName, stage }) => {
  return new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: domainName + "/" + stage,
  });
}

exports.buildMessage = ({ id, roomId, authorId, text, createdAt }) => {
  return { id, roomId, authorId, text, createdAt };
}

exports.broadcastMessageInRoom = async (requestContext, message, roomId) => {
  const { connectionId } = requestContext;
  const connectionIds = (await getConnectionIdsByRoomId(roomId))
    .filter(id => id != connectionId);

  if (!connectionIds.length) {
    return;
  }

  const Data = JSON.stringify(message);
  const messages = connectionIds.map(ConnectionId => ({ ConnectionId, Data }));
  const client = buildApiGatewayManagementApiClient(requestContext);
  const result = await broadcastMessages(client, messages);
  return handleBroadcastMessagesResult(result);
}

const broadcastMessages = async (client, messages) => {
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

const handleBroadcastMessagesResult = async ({ successful, staled }) => {
  const batch = createBatch()
  successful.map(message => batch.pushEvent('sent', message))
  await trackBatch(batch);

  const connectionIds = staled.map(({ ConnectionId}) => ConnectionId);
  await removeConnectionIdsFromAllRooms(connectionIds);
}
