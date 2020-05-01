// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
/*
Msg -> Admin: 
{
  src: {
    connId: xxxx
    uuid: xxxxxx-xxxxxx-xxxxxx
    userdata:
  }
  dest: {
    connId:
    uuid: admin | uuid
  payload: {
    text:
  }
}

*/
const AWS = require("aws-sdk");


const DEBUG = process.env.AWS_REGION
// const DEBUG = false
const { TABLE_NAME } = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});


// if (DEBUG) {
endpoint = "jhdk924ki7.execute-api.us-east-1.amazonaws.com/Prod/"
// } else {
//   endpoint = event.requestContext.domainName + "/" + event.requestContext.stage
// }
const apigwManagementApi = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: endpoint,
});

async function storeMessage(uuid, message, ts) {

  // if (DEBUG) { console.log(now) }
  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PartitionKey: `uuid:${uuid}`,
      message: message,
      SortKey: `msg:${ts}`,
    }
  };
  console.log(await ddb.put(putParams).promise());
}

async function getConnId(uuid) {
  var params = {
    KeyConditionExpression: 'PartitionKey = :uuid AND begins_with(SortKey, :role)',
    ExpressionAttributeValues: {
      ':uuid': `uuid:${uuid}`,
      ':role': "role"
    },
    TableName: TABLE_NAME
  };

  results = await ddb
    .query(params)
    .promise();
  console.log("AdminID: ", results.Items)
  return results.Items[0]
}

exports.handler = async event => {
  // const adminId = await getConnId("admin")
  console.log(JSON.parse(event.body))
  const timestamp = new Date().toISOString();


  adminId = await getConnId("admin")

  const payload = JSON.parse(event.body).payload;
  if (!payload.src) {
    payload.src = {}
  }
  payload.ts = timestamp
  payload.src.connId = event.requestContext.connectionId

  let uuid = payload.src.uuid === adminId.uuid ? payload.dest.uuid : payload.src.uuid

  storeMessage(uuid, payload, timestamp)

  console.log("new payload", payload)
  try {
    await apigwManagementApi
      .postToConnection({ ConnectionId: payload.dest.connId, Data: JSON.stringify(payload) })
      .promise();
  } catch (err) {
    let destUuid = await getConnId(payload.dest.uuid)


    let resp = await apigwManagementApi
      .postToConnection({ ConnectionId: destUuid.cid, Data: JSON.stringify(payload) })
      .promise();
    console.log(resp)
  }


  return { statusCode: 200, body: "Data sent." };
};