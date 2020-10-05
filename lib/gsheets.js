const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, null,
);
/* Load a valid access token for your Google user */
const accessToken = null;

// Construct an oAuth client with your client information that you've securely stored in the environment
oAuth2Client.setCredentials({
    access_token: accessToken,
});

const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client
});

/**
 *
 * @param {String} gsheetId ID of the Google Spreadsheet.
 * @param {Object} data data to add to the sheet as key-value pairs.
 */
exports.add = async (gsheetId, data) => {
    const rows = [data.ID, data.name, data.email];
    // add to the bottom of the sheet.
    await sheets.spreadsheets.values.append({
        spreadsheetId: gsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [rows],
        },
    });
};
