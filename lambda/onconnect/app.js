// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
  console.log(event)
  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      SortKey: event.requestContext.connectionId,
      PartitionKey: "NEW"
    }
  };



  // try {
  //   await ddb.put(putParams).promise();
  // } catch (err) {
  //   return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  // }

  return { statusCode: 200, body: 'Connected.' };
};
