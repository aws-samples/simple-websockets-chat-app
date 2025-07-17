// Copyright 2018-2020Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DynamoDBClient, DeleteItemCommand} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(ddb);

const { TABLE_NAME } = process.env;

// ES6 type module syntax
export const handler = async (event) => {
  
  const scanCmd = new ScanCommand({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId' });

  let connectionData;
  try {
    connectionData = await docClient.send(scanCmd);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }
  
  const apigwManagementApi = new ApiGatewayManagementApiClient({
        // The endpoint is intentionally constructed using the API ID and stage from the event to account for custom domains
    endpoint: `https://${event.requestContext.apiId}.execute-api.${process.env.AWS_REGION}.amazonaws.com/${event.requestContext.stage}`
  });
  
  const postData = JSON.parse(event.body).data;
  
  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      const postCmd = new PostToConnectionCommand({ ConnectionId: connectionId, Data: postData });
      await apigwManagementApi.send(postCmd);
    } catch (e) {
      if (e.statusCode === 410) {
        
        console.log(`Found stale connection, deleting ${connectionId}`);
    
        const deleteParams = {
          TableName: process.env.TABLE_NAME,
          Key: {
            connectionId: { S: event.requestContext.connectionId }
          }
        };
        const delCmd = new DeleteItemCommand(deleteParams);
        await ddb.send(delCmd);

      } else {
        throw e;
      }
    }
  });
  
  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
