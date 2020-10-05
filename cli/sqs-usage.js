// TODO: Load the env.yml in order to have these not hardcoded
process.env.AWS_PROFILE = 'my-gsheets-htmlform';  // 'serverless-cli';
process.env.AWS_REGION = 'eu-west-1';
process.env.AWS_SQS_PROCESSDATA = 'my-gsheets-htmlform-dev-processData';

// configure the AWS - note it willm internally use the process.env.AWS_REGION
const AWS = require('aws-sdk');
AWS.config.update({ region : process.env.AWS_REGION, });

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

sqs
    .getQueueUrl({
        QueueName: process.env.AWS_SQS_PROCESSDATA
    })
    .promise()
    .then(result => result.QueueUrl)
    .then(url => console.log(url))
    .catch(err => console.error(err));