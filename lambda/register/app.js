const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});
const { TABLE_NAME, DEBUG } = process.env;
// const DEBUG = true

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

async function getCurrentSessions(adminId, userConnId) {
  console.log(adminId, userConnId)
  var params = {
    KeyConditionExpression: 'PartitionKey = :userid AND SortKey = :adminid',
    ExpressionAttributeValues: {
      ':userid': `wsid:${userConnId}`,
      ':adminid': `wsid:${adminId.cid}`
    },
    TableName: TABLE_NAME
  };
  result = await ddb
    .query(params)
    .promise();
  console.log("results:", result)
  return result
}

async function addAdminSession(adminData, userConnId) {

  let sessions = await getCurrentSessions(adminData, userConnId)
  time = Date.now()
  console.log(time)
  console.log("addAdminSession", "no current sessions found")
  item = {
    PartitionKey: `awsid:${adminData.cid}`,
    SortKey: `cwsid:${userConnId}`,
    cid: adminData.SortKey,
    timestamp: time,
  }
  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: item,
  };
  await ddb.put(putParams).promise();
}

async function addUserSession(event, adminId, userData) {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });

  let payload = JSON.stringify({
    event: "connchange",
    userdata: userData
  });
  if (!DEBUG) {
    await apigwManagementApi
      .postToConnection({ ConnectionId: adminId, Data: payload })
      .promise();
  }
}

exports.handler = async event => {
  let connectionData;
  let item;
  let adminData

  const putParams = {
    TableName: process.env.TABLE_NAME,
  };
  try {
    adminData = await getAdminConnId()
  } catch (err) { return err }
  console.log("AdminData", adminData)
  // If user sends valid JWT token we list them as an admin, otherwise we add them as a user.
  try {
    decodedToken = jwt.decode(JSON.parse(event.body).token);
    item = {
      PartitionKey: `role:ADMIN`,
      SortKey: `cid:${decodedToken.sub}`,
      cid: event.requestContext.connectionId,
    }
    putParams.Item = item
    await ddb.put(putParams).promise();
  } catch (err) {
    data = JSON.parse(event.body)
    console.log(data)
    item = {
      PartitionKey: `uuid:${data.userdata.uuid}`,
      name: data.userdata.name,
      cid: event.requestContext.connectionId,
      SortKey: `role:USER`,
    }
    putParams.Item = item
    ddb.put(putParams).promise();
    let userData = data.userdata
    userData["connId"] = event.requestContext.connectionId
    //addUserSession(event, adminData.cid, userData)
  }

  // try {
  //   //await addUserSession(event, adminData)
  //   await addAdminSession(adminData, event.requestContext.connectionId)

  // } catch (err) {
  //   console.log(err)
  //   return {
  //     statusCode: 500,
  //     body: "Failed to connect: " + JSON.stringify(err)
  //   };
  // }

  return { statusCode: 200, body: "Connected." };
};

