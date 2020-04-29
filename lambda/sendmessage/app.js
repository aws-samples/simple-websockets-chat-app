// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});
const DEBUG = process.env.AWS_REGION
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
  /*
    inbound: dest, text
    outbound: source, text
  */
  if (DEBUG) {
    endpoint = "jhdk924ki7.execute-api.us-east-1.amazonaws.com/Prod/"
  } else {
    endpoint = event.requestContext.domainName + "/" + event.requestContext.stage
  }
  adminId = await getAdminConnId()
  console.log(adminId.cid)
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: endpoint,
  });
  console.log(event.body)
  const postData = JSON.parse(event.body);
  if (!("userdata" in postData)) {
    postData.userdata = {
      uuid: null,
      name: {
        first: null,
        last: null
      }
    }
  }
  postData.userdata.connId = event.requestContext.connectionId
  console.log(postData)
  // postData.body[connectionId] = connectionId;
  let payload = JSON.stringify({
    message: postData,
    source: event.requestContext.connectionId
  });
  dest = ("dest" in postData) ? postData.dest : adminId.cid
  await apigwManagementApi
    .postToConnection({ ConnectionId: dest, Data: JSON.stringify(postData) })
    .promise();


  return { statusCode: 200, body: "Data sent." };
};

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