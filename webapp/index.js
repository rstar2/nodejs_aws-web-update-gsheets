const path = require('path');
const express = require('express');

const SQSClient = require('../lib/sqs-client');

const app = express();

// configure the templating views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// could have a collection ofr Google Sheets, but for now only
const gsheetId = process.env.GOOGLE_SHEET_ID;

// the name of the AWS SQS to which to send messages from here
const sqs_QueueName = process.env.AWS_SQS_PROCESSDATA;

const sqsClient = new SQSClient(sqs_QueueName);

const stage = process.env.AWS_STAGE;
app.locals['contextPath'] = stage ? '/' + stage : '';

// render the HTML form
app.get('/', (req, res) => res.render('index', { gsheetId }));

// handle the HTML form action
app.post('/update/:gsheetId', async (req, res) => {
    const { gsheetId } = req.params; // The Google Sheet ID
    const data = req.body; // The post body

    // Validation

    // 1. Form data ....
    if (!data.name || !data.email)
        throw new Error('Invalid form data');
    // 2. Proper permissions tot update the sheet

    const message = { gsheetId, data };
    console.log(`Sending message to SQS ${sqs_QueueName}:`, message);

    try {
        // Send the data to our SQS queue for further processing
        await sqsClient.sendMessage(message);

        console.log('Success sending message');
        // fast return response to client
        // so he'll experience no delay because of the real data processing
        res.status(200).send('OK');
    } catch(err) {
        console.error('Error sending message', err);

        // fast return response to client
        // so he'll experience no delay because of the real data processing
        res.status(500).json(JSON.stringify(err));
    }
    
});

module.exports = app;
