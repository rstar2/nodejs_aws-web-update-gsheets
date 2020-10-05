const awsServerlessExpress = require('aws-serverless-express');
const app = require('./webapp');
const server = awsServerlessExpress.createServer(app);

/**
 * Handle messages from the API Gateway service 
 * @param {AWSLambda.APIGatewayEvent} event 
 * @param {AWSLambda.Context} context 
 */
exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};