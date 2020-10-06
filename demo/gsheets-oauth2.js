const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

const CREDENTIALS = require(process.env.GOOGLE_OAUTH2_CREDENTIALS_FILE ||
    '../google-oauth2-client-credentials.json');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = process.env.GOOGLE_OAUTH2_TOKEN_FILE || 'google-oauth2-client-token.json';


// Authorize a client with credentials, then call the Google Sheets API.
authorize(CREDENTIALS, ready);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {Function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);

        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
  
/**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {Function} callback The callback for the authorized client.
   */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function ready(auth) {
    console.log('Ready');

    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet1!A2:D',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        console.log('Data:', res.data.values);
    });
}