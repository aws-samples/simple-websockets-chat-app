const { saveConnection } = require("../api/connection");

module.exports = async event => {
  const { connectionId } = event.requestContext;
  await saveConnection(connectionId);
  return { statusCode: 200, body: "Connected." };
};
