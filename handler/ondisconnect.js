import {DeleteItemCommand, DynamoDBClient} from '@aws-sdk/client-dynamodb'
const client = new DynamoDBClient()


export const handler = async event => {

  console.log('event', JSON.stringify(event, null, 2))

  const deleteParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      connectionId: event.requestContext.connectionId
    }
  }

  try {
    await client.send(new DeleteItemCommand(deleteParams))
  } catch (err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) }
  }

  return { statusCode: 200, body: 'Disconnected.' }
}
