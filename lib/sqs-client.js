const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

class SQSClient {
    /**
     * @param {String} sqsName
     */
    constructor(sqsName) {
        /**
         * @type {Promise<String>}
         */
        this._sqsQueueUrl = sqs
            .getQueueUrl({ QueueName: sqsName, })
            .promise()
            .then(result => result.QueueUrl);
    }

    /**
     *
     * @param {Object} message
     * @return {Promise}
     */
    async sendMessage(message) {

        // get the queue name only once and after that reuse
        return this._sqsQueueUrl
            .then(queueUrl => {
                console.log('Got queue url', queueUrl);
                const params = {
                    MessageBody: JSON.stringify(message),
                    QueueUrl: queueUrl,
                };
                return sqs.sendMessage(params).promise();
            });
    }
}

module.exports = SQSClient;
