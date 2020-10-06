const path = require('path');
const { google } = require('googleapis');

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Must be full path to the credentials file
const CREDENTIALS_FILE =
  process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE ||
  path.resolve(__dirname, '../google-service-account-credentials.json');

const SCOPES = [
    // if just to reading
    // 'https://www.googleapis.com/auth/spreadsheets.readonly',

    // if for reading and updating
    'https://www.googleapis.com/auth/spreadsheets'
];

const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_FILE,
    scopes: SCOPES,
});

/**
 * @param {google.auth.GoogleAuth} auth The authenticated Google Service Account.
 */
async function ready(auth) {
    console.log('Ready');

    const sheets = google.sheets({ version: 'v4', auth });

    // read
    await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet1!A2:D',
    });

    // update
    await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'A2',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [
                ['Rumen 3', 'Neshev 3', 'email 3'],
                ['Rumen 4', 'Neshev 4', 'email 4'],
                // Potential next row
            ],
        },
    });
}

try {
    ready(auth);
} catch (err) {
    console.error(err);
}
