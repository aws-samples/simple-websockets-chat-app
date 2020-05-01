const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});
const { TABLE_NAME, DEBUG } = process.env;
// let endpoint, event
// // if (DEBUG) {
// endpoint = "jhdk924ki7.execute-api.us-east-1.amazonaws.com/Prod/"
// } else {
//   endpoint = event.requestContext.domainName + "/" + event.requestContext.stage
// }

// const apigwManagementApi = new AWS.ApiGatewayManagementApi({
//   apiVersion: "2018-11-29",
//   endpoint: endpoint
// });

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
  // console.log("AdminID: ", results.Items)
  return results.Items[0]
}
// const DEBUG = true

// async function getAdminConnId() {
//   var params = {
//     KeyConditionExpression: 'PartitionKey = :role AND begins_with ( SortKey , :connid )',
//     ExpressionAttributeValues: {
//       ':role': "role:ADMIN",
//       ':connid': "cid"
//     },
//     TableName: TABLE_NAME
//   };

//   results = await ddb
//     .query(params)
//     .promise();
//   //console.log("AdminID: ", results.Items[0].cid)
//   return results.Items[0]
// }

// async function getCurrentSessions(adminId, userConnId) {
//   console.log(adminId, userConnId)
//   var params = {
//     KeyConditionExpression: 'PartitionKey = :userid AND SortKey = :adminid',
//     ExpressionAttributeValues: {
//       ':userid': `wsid:${userConnId}`,
//       ':adminid': `wsid:${adminId.cid}`
//     },
//     TableName: TABLE_NAME
//   };
//   result = await ddb
//     .query(params)
//     .promise();
//   console.log("results:", result)
//   return result
// }

// async function addAdminSession(adminData, userConnId) {

//   let sessions = await getCurrentSessions(adminData, userConnId)
//   time = Date.now()
//   console.log(time)
//   console.log("addAdminSession", "no current sessions found")
//   item = {
//     PartitionKey: `awsid:${adminData.cid}`,
//     SortKey: `cwsid:${userConnId}`,
//     cid: adminData.SortKey,
//     timestamp: time,
//   }
//   const putParams = {
//     TableName: process.env.TABLE_NAME,
//     Item: item,
//   };
//   await ddb.put(putParams).promise();
// }

// async function addUserSession(event, adminId, userData) {
//   const apigwManagementApi = new AWS.ApiGatewayManagementApi({
//     apiVersion: "2018-11-29",
//     endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
//   });

//   let payload = JSON.stringify({
//     event: "connchange",
//     userdata: userData
//   });
//   if (!DEBUG) {
//     await apigwManagementApi
//       .postToConnection({ ConnectionId: adminId, Data: payload })
//       .promise();
//   }
// }

async function getHistory(uuid) {
  var params = {
    TableName: TABLE_NAME,
    FilterExpression: "begins_with(SortKey, :msg)",

    ExpressionAttributeValues: {
      ":msg": "msg:",
    }
  };
  // let params = {
  //   KeyConditionExpression: 'PartitionKey = :role AND begins_with ( SortKey , :connid )',
  //   ExpressionAttributeValues: {
  //     ':role': "role:ADMIN",
  //     ':connid': "cid"
  //   },
  //   TableName: TABLE_NAME
  // };
  connId = await getConnId('admin')
  console.log(connId.cid)
  results = await ddb
    .scan(params)
    .promise();
  //console.log("AdminID: ", results.Items[0].cid)

  for (i = 0; i < results.Items.length; i++) {
    payload = results.Items[i].message
    console.log(payload)
    apigwManagementApi
      .postToConnection({ ConnectionId: connId.cid, Data: JSON.stringify(payload) })
      .promise();
  }
}
async function sendMessages(payload) {

}
exports.handler = async event => {
  //await getHistory("admin")
  let connectionData;
  let item;
  let adminData
  let items = []
  try {
    const decodedToken = jwt.decode(JSON.parse(event.body).token);
    console.log("Admin Registration Detected: ", decodedToken)
    await ddb.put({
      TableName: process.env.TABLE_NAME,
      Item: {
        PartitionKey: `uuid:admin`,
        SortKey: `role:admin`,
        cid: event.requestContext.connectionId,
        uuid: `${decodedToken.sub}`
      }
    }).promise()
    await ddb.put({
      TableName: process.env.TABLE_NAME,
      Item: {
        PartitionKey: `uuid:${decodedToken.sub}`,
        SortKey: `role:admin`,
        cid: event.requestContext.connectionId,
      }
    }).promise()
  } catch (err) {
    console.log(err)
    data = JSON.parse(event.body)
    console.log(data)
    await ddb.put({
      TableName: process.env.TABLE_NAME,
      Item: {
        PartitionKey: `uuid:${data.userdata.uuid}`,
        name: data.userdata.name,
        cid: event.requestContext.connectionId,
        SortKey: `role:user`,
      }
    }).promise()
  }

  // const res = await items.map(async function (item) {
  //   // console.log(items)
  //   const putParams = { TableName: process.env.TABLE_NAME, Item: item }
  //   console.log(putParams)
  //   return await ddb.put(putParams).promise()

  // })
  // console.log(res)
  return { statusCode: 200, body: "Connected." };
};

