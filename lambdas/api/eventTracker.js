
const AWS = require("aws-sdk");

const {
  AWS_REGION,
  EVENTS_STREAM: DeliveryStreamName,
} = process.env;

const kinesis = new AWS.Firehose();

const buildRecord = event => ({
  Data: JSON.stringify(event) + "\n"
});

const buildEvent = (e, payload) => {
  const ts = new Date().getTime();
  return { ...payload, e, ts }
}

exports.trackEvent = (e, payload) => {
  const record = {
    DeliveryStreamName,
    Record: buildRecord(buildEvent(e, payload)),
  };

  return kinesis
    .putRecord(record)
    .promise()
};

exports.createBatch = () => {
  const events = [];
  const batch = {
    length: events.length,
    pushEvent: (e, payload) => events.push(buildEvent(e, payload)),
    getRecords: () => events.map(buildRecord)
  };

  return batch;
}

exports.trackBatch = batch => {
  const Records = batch.getRecords();
  if (!Records || !Records.length) {
    return;
  }

  const payload = { DeliveryStreamName, Records };

  return kinesis
    .putRecordBatch(payload)
    .promise();
};
