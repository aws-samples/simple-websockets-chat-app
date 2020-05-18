const log = require('../helpers/log');
const AWS = require("aws-sdk");
const {
  AWS_REGION,
  LOCAL_DYNAMODB_ENDPOINT: endpoint,
  TABLE_NAME: TableName,
  TABLE_TTL_HOURS: ttlHours,
  CONNECTION_ID_INDEX: IndexName
} = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
  endpoint: endpoint && endpoint.length ? endpoint : undefined,
});

exports.put = Item => {
  Item.ttl = new Date().getTime() + 1000 * 60 * 60 * ttlHours;
  log('put', Item);
  return ddb
    .put({ TableName, Item })
    .promise();
}

const queryItems = async query => {
  log('queryItems', query);
  const { Items } = await ddb.query(query).promise();
  log('queryItems', Items);
  return Items;
}

const findAllByRoomId = roomId => {
  const query = {
    TableName,
    KeyConditionExpression: `roomId = :key`,
    ExpressionAttributeValues: { ":key": roomId },
  };

  return queryItems(query);
}
exports.findAllByRoomId = findAllByRoomId;
exports.connectionIdsByRoomId = async roomId => {
  return (await findAllByRoomId(roomId)).map(({ connectionId }) => connectionId);
}

const findAllByConnectionId = connectionId => {
  const query = {
    TableName,
    IndexName,
    KeyConditionExpression: `connectionId = :key`,
    ExpressionAttributeValues: { ":key": connectionId },
  };

  return queryItems(query);
}
exports.findAllByConnectionId = findAllByConnectionId;
exports.roomIdsByConnectionId = async connectionId => {
  return (await findAllByConnectionId(connectionId)).map(({ roomId }) => roomId)
}

const deleteItems = async items => {
  log('deleteItems', items);
  if (!items || !items.length) {
    return [];
  }

  const keys = items.map(({ roomId, connectionId }) => ({ roomId, connectionId }));
  const deleteRequests = keys.map(Key => ({ DeleteRequest: { Key } }));

  const params = {
    RequestItems: {
      [TableName]: deleteRequests,
    },
  };

  await ddb.batchWrite(params).promise();
  return keys;
}

exports.deleteAllByRoomId = async roomId => {
  const items = await findAllByRoomId(roomId);
  return deleteItems(items);
}

exports.deleteAllByConnectionId = async connectionId => {
  const items = await findAllByConnectionId(connectionId);
  return deleteItems(items);
}
