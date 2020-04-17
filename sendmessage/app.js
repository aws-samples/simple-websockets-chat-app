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
  let connectionData;
  let roomId;
  const postData = JSON.parse(event.body).data;

  try {
    const { roomId } = JSON.parse(postData);
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
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi
        .postToConnection({ ConnectionId: connectionId, Data: postData })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb
          .delete({ TableName: TABLE_NAME, Key: { roomId, connectionId } })
          .promise();
      } else {
        throw e;
      }
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Data sent." };
};
