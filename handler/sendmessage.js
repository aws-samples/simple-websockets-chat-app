import { DynamoDBClient, ScanCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const { TABLE_NAME } = process.env

export const handler = async event => {
  // console.log('event', JSON.stringify(event, null, 2))

  let connectionData

  try {
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      ProjectionExpression: 'connectionId',
    })
    connectionData = await ddbClient.send(scanCommand)
  } catch (e) {
    return { statusCode: 500, body: e.stack }
  }

  const apiGwClient = new ApiGatewayManagementApiClient({
    apiVersion: '2018-11-29',
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
  })

  const postData = JSON.parse(event.body).data

  const postCalls = connectionData.Items.map(async (dynamoItem) => {
    try {
      console.log(`Sending data to ${dynamoItem.connectionId.S}`)
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: dynamoItem.connectionId.S,
        Data: postData,
      })
      await apiGwClient.send(postToConnectionCommand)
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${dynamoItem.connectionId.S}`)
        const deleteCommand = new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { connectionId: { S: dynamoItem.connectionId.S } },
        })
        await ddbClient.send(deleteCommand)
      } else {
        throw e
      }
    }
  })

  try {
    await Promise.all(postCalls)
  } catch (e) {
    return { statusCode: 500, body: e.stack }
  }

  return { statusCode: 200, body: 'Data sent.' }
}
