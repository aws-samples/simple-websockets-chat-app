const AWS = require("aws-sdk");
const {
  AWS_REGION,
  LOCAL_DYNAMODB_ENDPOINT: endpoint,
} = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
  endpoint: endpoint && endpoint.length ? endpoint : undefined,
});

exports.put = (TableName, Item) => {
  return ddb
    .put({ TableName, Item })
    .promise();
}

exports.queryTable = (TableName, key, value) => {
  const query = {
    TableName,
    KeyConditionExpression: `${key} = :key`,
    ExpressionAttributeValues: { ":key": value },
  };

  return ddb.query(query).promise();
}

exports.queryIndex = (TableName, IndexName, key, value) => {
  const query = {
    TableName,
    IndexName,
    KeyConditionExpression: `${key} = :key`,
    ExpressionAttributeValues: { ":key": value },
  };
  return ddb
    .query(query)
    .promise();
}

const toDeleteRequest = Key => ({ DeleteRequest: { Key } });

exports.removeKeys = (TableName, keys) => {
  if (!keys || !keys.length) {
    return;
  }

  const deleteRequests = keys.map(toDeleteRequest);
  const params = {
    RequestItems: {
      [TableName]: deleteRequests,
    },
  };

  return ddb.batchWrite(params).promise();
}
