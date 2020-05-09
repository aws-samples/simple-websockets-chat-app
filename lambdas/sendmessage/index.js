const { broadcastMessageInRoom, buildMessage } = require('../api/message')

module.exports = async (event) => {
  const { body, requestContext } = event;
  const postData = JSON.parse(body).data;
  const { id, roomId, authorId, text, createdAt } = JSON.parse(postData);

  const message = buildMessage({ id, roomId, authorId, text, createdAt });
  await broadcastMessageInRoom(event.requestContext, message, roomId);

  return { statusCode: 200, body: "Data sent." };
};
