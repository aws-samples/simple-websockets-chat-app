// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");

const {
  AWS_REGION,
  LOCAL_DYNAMODB_ENDPOINT: endpoint,
  TABLE_NAME: TableName,
} = process.env;
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
  endpoint: endpoint && endpoint.length ? endpoint : undefined,
});

exports.handler = async (event) => {
  try {
    const putParams = {
      TableName,
      Item: {
        roomId: event.queryStringParameters.j,
        connectionId: event.requestContext.connectionId,
      },
    };

    await ddb.put(putParams).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: "Connected." };
};
