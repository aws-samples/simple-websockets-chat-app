const AWS = require("aws-sdk");
const {
  AWS_REGION,
  LOCAL_DYNAMODB_ENDPOINT: endpoint,
} = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
  endpoint: endpoint && endpoint.length ? endpoint : undefined,
});

exports.put = (TableName, Item) => {
  return ddb
    .put({ TableName, Item })
    .promise();
}

exports.removeConnectionFromAllRooms = async (connectionId) => {

}
