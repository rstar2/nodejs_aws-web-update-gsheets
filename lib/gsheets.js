
const { google } = require('googleapis');

const SCOPES = [
    // if just to reading
    // 'https://www.googleapis.com/auth/spreadsheets.readonly',

    // if for reading and updating
    'https://www.googleapis.com/auth/spreadsheets',
];

/**
 * 
 * @param {String} keyFile Google ServiceAccount Credentials - key JSON file. Must be full path
 */
module.exports = function (keyFile) {
    // authorize
    const auth = new google.auth.GoogleAuth({
        keyFile: keyFile,
        scopes: SCOPES,
    });
    const sheets = google.sheets({ version: 'v4', auth });

    return {
        /**
         *
         * @param {String} gsheetId ID of the Google Spreadsheet.
         * @param {{name:String, email: String}} data data to add to the sheet as key-value pairs.
         */
        async append(gsheetId, data) {
            const rows = [data.name, data.email, new Date().toISOString()];
            // add to the bottom of the sheet.
            await sheets.spreadsheets.values.append({
                spreadsheetId: gsheetId,
                range: 'A2',
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                    values: [rows],
                },
            });
        },
    };
};
