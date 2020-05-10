
const AWS = require("aws-sdk");

const {
  AWS_REGION,
  EVENTS_STREAM: DeliveryStreamName,
} = process.env;

const kinesis = new AWS.Firehose();

const buildRecord = event => ({
  Data: JSON.stringify(event) + "\n"
});

const buildEvent = (e, data) => {
  console.log(e, data);
  const ts = new Date().getTime();
  return { ...data, e, ts }
}

exports.trackEvent = (e, data) => {
  const record = {
    DeliveryStreamName,
    Record: buildRecord(buildEvent(e, data)),
  };

  return kinesis
    .putRecord(record)
    .promise()
};

exports.createBatch = () => {
  const events = [];
  const batch = {
    length: events.length,
    pushEvent: (e, data) => events.push(buildEvent(e, data)),
    getRecords: () => events.map(buildRecord)
  };

  return batch;
}

exports.trackBatch = batch => {
  const Records = batch.getRecords();
  if (!Records || !Records.length) {
    return;
  }

  const data = { DeliveryStreamName, Records };

  return kinesis
    .putRecordBatch(data)
    .promise();
};
