// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-route-keys-connect-disconnect.html
// The $disconnect route is executed after the connection is closed.
// The connection can be closed by the server or by the client. As the connection is already closed when it is executed,
// $disconnect is a best-effort event.
// API Gateway will try its best to deliver the $disconnect event to your integration, but it cannot guarantee delivery.

const AWS = require("aws-sdk");

const {
  AWS_REGION,
  LOCAL_DYNAMODB_ENDPOINT: endpoint,
  TABLE_NAME: TableName,
  CONNECTION_ID_INDEX: IndexName,
} = process.env;
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
  endpoint: endpoint && endpoint.length ? endpoint : undefined,
});

const findRoomsForConnectionId = async (connectionId) => {
  const query = {
    TableName,
    IndexName,
    KeyConditionExpression: "connectionId = :connectionId",
    ExpressionAttributeValues: { ":connectionId": connectionId },
  };
  const { Items } = await ddb.query(query).promise();
  return Items;
};

const toDeleteRequest = ({ roomId, connectionId }) => ({
  DeleteRequest: { Key: { roomId, connectionId } },
});

exports.handler = async (event) => {
  try {
    const { connectionId } = event.requestContext;
    const itemsToDelete = await findRoomsForConnectionId(connectionId);
    if (itemsToDelete.length) {
      const deleteRequests = itemsToDelete.map(toDeleteRequest);
      const params = {
        RequestItems: {
          [TableName]: deleteRequests,
        },
      };
      await ddb.batchWrite(params).promise();
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to disconnect: " + err.message,
    };
  }

  return { statusCode: 200, body: "Disconnected." };
};