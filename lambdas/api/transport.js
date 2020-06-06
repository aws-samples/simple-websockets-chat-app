const AWS = require("aws-sdk");
const { isDevelopment } = require('../helpers/config')
const { debug } = require('../helpers/log').buildLogger('API/TRANSPORT')

const buildDevelopmentClient = () => {
  return {
    postToConnection: (message) => ({
      promise: () => {
        debug('postToConnection', message);
        return Promise.resolve(message)
      }
    })
  }
}

const buildProductionClient = ({ domainName, stage }) => {
  return new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: domainName + "/" + stage,
  });
}

module.exports = isDevelopment ? buildDevelopmentClient : buildProductionClient;
