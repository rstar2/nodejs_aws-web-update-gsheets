
const path = require('path');

// Must be full path to the credentials file
const CREDENTIALS_FILE = path.resolve(
    __dirname,
    'google-service-account-credentials.json'
);

const gSheets = require('./lib/gsheets')(CREDENTIALS_FILE);

/**
 * Handle messages from the AWS SQS service 
 * @param {AWSLambda.SQSEvent} event 
 * @param {AWSLambda.Context} context 
 */
exports.handler = async (event, context) => {
    // console.log('Handle SQS event', event);
    
    const messages = event.Records;

    // This little logic helps us throttle our API interactions
    await messages.reduce(async (previousPromise, nextMessage) => {
        await previousPromise;
      
        const { gsheetId, data } = JSON.parse(nextMessage.body);

        console.log(`Inserting into Google Sheet ${gsheetId}, data:`, data);
      
        await gSheets.append(gsheetId, data);
      
        // Throttle for the Google API
        await throttle();

    }, Promise.resolve());

};

/**
 * Wait certain amount of time
 * @param {Number} timeout
 * @return {Promise<void>}
 */
const wait = async (timeout) => new Promise(resolve => {
    setTimeout(resolve, timeout);
});

/**
 * Fixed throttling for 1 second (1000 milliseconds) because of the GoogleAPI rate limiting
 * @return {Promise<void>}
 */
const throttle = async () => wait(1000);