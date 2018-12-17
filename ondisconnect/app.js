// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
var ddb = new AWS.DynamoDB({apiVersion: "2012-10-08"});

exports.handler = function (event) {
  var scanParams = {
    TableName: "sipmlechat",
    ProjectionExpression: "connectionId"
  };

  ddb.scan(scanParams, function (err, data) {
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(data)
      });
    } else {
      var apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: event.context.apiId + ".execute-api." + process.env.AWS_REGION + ".amazonaws.com/" + event.context.stage
      });
      var body = JSON.parse(event.body);

      data.Items.forEach(function (element) {
        var postParams = {
          connectionId: element.connectionId.S,
          data: body.message
        };

        apigwManagementApi.postToConnection(postParams, function (err, data) {
          if (err) {
            // API Gateway returns a status of 410 GONE 
            // when the connection is no longer available.  
            // If this happens, we simply delete the 
            //identifier from our DynamoDB table.
            if (err.statusCode === 410) {
              console.log("Found stale connection, deleting " + postParams.connectionId);
              DDB.deleteItem({ TableName: process.env.TABLE_NAME,
                               Key: { connectionId: { S: postParams.connectionId } } });
            } else {
              console.log("Failed to post. Error: " + JSON.stringify(err));
            }
          }
        });
      });

      callback(null, {
        statusCode: 200,
        body: "Sent."
      });
    }
  })
};