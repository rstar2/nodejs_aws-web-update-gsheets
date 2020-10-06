## For Demo usage:

1. Create a new AWS user with proper permissions for using SQS service
2. Add key/secret for it and add as AWS profile in the ".aws/config" folder
3. Set env variable AWS_PROFILE=xxxx (this user) so that the 'aws-sdk' module can authorize with AWS
4. Ser evn variable GOOGLE_SHEET_ID=XXXXX (the Google Sheet ID)

## For Google Sheets

1. Create anew Google Project
2. Enable Google Sheets API in the project

3. Create new Credentials (with OAuth2)
    3.1. Either as OAuth2 client - not good for this use case (It's on behalf of a single Google user)
      - First configure the 'OAuth consent screen' - just providing a name is ok, it's not shown
      - Create new credentials of type "OAuth client ID" and with "Desktop App" as application type
      - Download the credentials JSON file
    3.2. Or As ServiceAccount - much better for server to gsheets communication
      - Create a ServiceAccount (no need to set any roles and etc - its not used here)
      - Create a Key for this ServiceAccount, e.g. a JSON credentials file
      - Copy the ServiceAccount's email (like xxxxx@xxxx.iam.gserviceaccount.com) and allow this email to access the private Google Sheet (e.g. Share the sheet to this service account's email)

## TODO

- Make env.yml parsing to env properties be an npm module
- Possibly use 'serverless-layers' plugin and zip the 'gsheets'/'express' npm modules as layer(s).
  This is just for "test" how it works. (Note the 'aws-sdk' and other in devDependencies are not deployed anyway)
