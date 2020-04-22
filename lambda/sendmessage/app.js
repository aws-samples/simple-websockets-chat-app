// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});

const { TABLE_NAME } = process.env;

async function getAdminConnId() {
  var params = {
    KeyConditionExpression: 'PartitionKey = :role AND begins_with ( SortKey , :connid )',
    ExpressionAttributeValues: {
      ':role': "role:ADMIN",
      ':connid': "cid"
    },
    TableName: TABLE_NAME
  };

  results = await ddb
    .query(params)
    .promise();
  //console.log("AdminID: ", results.Items[0].cid)
  return results.Items[0]
}

exports.handler = async event => {
  let connectionData;
  //console.log(event);

  // try {
  //   connectionData = await ddb
  //     .scan({ TableName: TABLE_NAME, ProjectionExpression: "connectionId" })
  //     .promise();
  // } catch (e) {
  //   return { statusCode: 500, body: e.stack };
  // }
  endpoint = "jhdk924ki7.execute-api.us-east-1.amazonaws.com/Prod/"
  adminId = await getAdminConnId()
  console.log(adminId.cid)
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: endpoint,
    // endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });
  console.log(event.body)
  const postData = JSON.parse(event.body);
  console.log(postData)
  // postData.body[connectionId] = connectionId;
  let payload = JSON.stringify({
    message: postData,
    source: event.requestContext.connectionId
  });

  await apigwManagementApi
    .postToConnection({ ConnectionId: adminId.cid, Data: event.body })
    .promise();
  // const postCalls = connectionData.Items.map(async ({ connectionId }) => {
  //   try {
  // await apigwManagementApi
  //   .postToConnection({ ConnectionId: connectionId, Data: payload })
  //   .promise();
  //   } catch (e) {
  //     if (e.statusCode === 410) {
  //       console.log(`Found stale connection, deleting ${connectionId}`);
  //       await ddb
  //         .delete({ TableName: TABLE_NAME, Key: { connectionId } })
  //         .promise();
  //     } else {
  //       throw e;
  //     }
  //   }
  // });

  // try {
  //   await Promise.all(postCalls);
  // } catch (e) {
  //   return { statusCode: 500, body: e.stack };
  // }

  return { statusCode: 200, body: "Data sent." };
};
