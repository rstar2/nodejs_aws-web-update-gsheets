## For CLI usage:

1. Create a new AWS user with proper permissions for using SQS service
2. Add key/secret for it and add as AWS profile in the ".aws/config" folder
3. Set env variable AWS_PROFILE=xxxx (this user) so that the 'aws-sdk' module can authorize with AWS

## For Google Sheets

1. Create anew Google Project
2. Enable Google Sheets API in the project
3. Create new Credentials (with OAuth2)
   - First configure the 'OAuth consent screen' - just providing a name is ok, it's not shown
   - Create new credentials of type "OAuth client ID" and with "Desktop App" as application type
   - Download the credentials JSON file



## TODO:
- Make env.yml parsing to env properties be an npm module
- Possibly use 'serverless-layers' plugin and zip the 'gsheets'/'express' npm modules as layer(s).
  This is just for "test" how it works. (Note the 'aws-sdk' and other in devDependencies are not deployed anyway)
