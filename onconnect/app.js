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
const track = (record) => {
  return kinesis
    .putRecord({
      DeliveryStreamName,
      Record: { Data: JSON.stringify(record) + "\n" },
    })
    .promise();
};

exports.handler = async (event) => {
  let record = {};
  try {
    record.roomId = event.queryStringParameters.j;
    record.connectionId = event.requestContext.connectionId;
    await saveConnection(record);
  } catch (err) {
    await track({
      ...record,
      timestamp: event.requestContext.connectedAt,
      errorMessage: err.message,
      event: "error-joining",
    });
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }
  await track({ ...record, event: "joined" });

  return { statusCode: 200, body: "Connected." };
};
