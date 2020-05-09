
const AWS = require("aws-sdk");

const {
  AWS_REGION,
  EVENTS_STREAM: DeliveryStreamName,
} = process.env;

const kinesis = new AWS.Firehose();

exports.trackEvent = (e, payload) => {
  const ts = new Date().getTime();
  const data = { ...payload, e, ts }
  const record = {
    DeliveryStreamName,
    Record: { Data: JSON.stringify(data) + "\n" },
  };

  return kinesis
    .putRecord(record)
    .promise()
};
