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
const saveConnection = (Item) => {
  return ddb
    .put({
      TableName,
      Item,
    })
    .promise();
};

const kinesis = new AWS.Firehose();
const track = (payload) => {
  const record = {
    DeliveryStreamName,
    Record: { Data: JSON.stringify(payload) + "\n" },
  };

  if (endpoint) {
    console.log("tracking", record);
  }

  return kinesis
    .putRecord(record)
    .promise()
    .catch(({ message }) =>
      console.error("Error while tracking data: " + message, record)
    );
};

module.exports = async (event) => {
  let record = {};
  const timestamp = event.requestContext.connectedAt;
  try {
    record.roomId = event.queryStringParameters.j;
    record.connectionId = event.requestContext.connectionId;
    await saveConnection(record);
  } catch (err) {
    await track({
      ...record,
      timestamp,
      errorMessage: err.message,
      event: "error-joining",
    });
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }
  await track({ ...record, timestamp, event: "joined" });

  return { statusCode: 200, body: "Connected." };
};
