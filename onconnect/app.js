// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

var AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
var ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

exports.handler = async (event, context, callback) => {
    var putParams = {
        TableName: "simplechat",
        Item: {
            connectionId: { S: event.requestContext.connectionId }
        }
    };

    ddb.putParams(putParams, function(err, data) {
        callback(null, {
            statusCode: err ? 500 : 200,
            body: JSON.stringify(data);
        });
    });
};
