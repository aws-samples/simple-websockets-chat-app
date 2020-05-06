// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");

const {
  AWS_REGION,
  LOCAL_DYNAMODB_ENDPOINT: endpoint,
  TABLE_NAME: TableName,
  EVENTS_STREAM: DeliveryStreamName,
} = process.env;
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
  endpoint: endpoint && endpoint.length ? endpoint : undefined,
});
const kinesis = new AWS.Firehose();
const trackEvents = (events) => {
  if (!events || !events.length) {
    return;
  }

  const payload = {
    DeliveryStreamName,
    Records: events.map((record) => ({
      Data: JSON.stringify(record) + "\n",
    })),
  };

  if (endpoint) {
    console.log("tracking", payload);
  }

  return kinesis
    .putRecordBatch(payload)
    .promise()
    .catch(({ message }) =>
      console.error("Error while tracking data: " + message, payload)
    );
};

module.exports = async (event) => {
  let connectionData;
  const postData = JSON.parse(event.body).data;
  const { id: messageId, roomId, authorId } = JSON.parse(postData);
  const {
    domainName,
    stage,
    connectionId: senderConnectionId,
    connectedAt: timestamp,
  } = event.requestContext;

  try {
    const query = {
      TableName,
      KeyConditionExpression: "roomId = :roomId",
      ExpressionAttributeValues: { ":roomId": roomId },
    };

    connectionData = await ddb.query(query).promise();
  } catch (e) {
    console.log(e);
    return { statusCode: 500, body: e.stack };
  }

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: domainName + "/" + stage,
  });

  const events = [];

  const postCalls = connectionData.Items.map(
    async ({ roomId, connectionId }) => {
      try {
        if (connectionId !== senderConnectionId) {
          await apigwManagementApi
            .postToConnection({ ConnectionId: connectionId, Data: postData })
            .promise();
          events.push({
            messageId,
            roomId,
            authorId,
            senderConnectionId,
            connectionId,
            timestamp,
            event: "message-sent",
          });
        }
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Found stale connection, deleting ${connectionId}`);
          await ddb
            .delete({ TableName: TABLE_NAME, Key: { roomId, connectionId } })
            .promise();
          events.push({ connectionId, roomId, timestamp, event: "left" });
        } else {
          throw e;
        }
      }
    }
  );

  try {
    await Promise.all(postCalls);
    await trackEvents(events);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Data sent." };
};
