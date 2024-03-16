import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient()

export const handler = async event => {

  console.log('event', JSON.stringify(event, null, 2))

  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: {
        S: event.requestContext.connectionId
      },
    },
  }

  try {
    // Use the DynamoDB Document Client to put the item in the table
    const command = new PutItemCommand(putParams)
    await client.send(command)
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) }
  }

  return {statusCode: 200, body: 'Connected.'}
}



