// Copyright 2018-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; 

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });

// ES6 type module syntax
export const handler = async (event) => {

  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: { S: event.requestContext.connectionId }
    }
  };
  const putCmd = new PutItemCommand(putParams);
   
  try {
    await ddb.send(putCmd);
  } catch (err) {

    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
