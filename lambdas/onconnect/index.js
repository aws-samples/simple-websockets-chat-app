// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");
const { saveConnectionInRoom } = require("../api/room");

const {
  AWS_REGION,
  LOCAL_DYNAMODB_ENDPOINT: endpoint,
  EVENTS_STREAM: DeliveryStreamName,
} = process.env;

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
    const roomId = event.queryStringParameters.j;
    const connectionId = event.requestContext.connectionId;
    await saveConnectionInRoom(connectionId, roomId);
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
