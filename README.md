# simple-websockets-chat-app

This is the code and template for the simple-websocket-chat-app.  There are three functions contained within the directories and a SAM template that wires them up to a DynamoDB table and provides the minimal set of permissions needed to run the app:

```
.
├── README.md                   <-- This instructions file
├── onConnect                   <-- Source code onConnect
├── onDisconnect                <-- Source code onDisconnect
├── sendMessage                 <-- Source code sendMessage
└── template.yaml               <-- SAM template for Lambda Functions and DDB
```


# Deploying to your account

You have two choices for how you can deploy this code.

## Serverless Application Repository

The first and fastest way is to use AWS's Serverless Application Respository to directly deploy the components of this app into your account without needing to use any additional tools. You'll be able to review everything before it deploys to make sure you understand what will happen.  Click through to see the [application details](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:729047367331:applications~simple-websockets-chat-app).

## AWS CLI commands

If you prefer, you can install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) and use it to package, deploy, and describe your application.  These are the commands you'll need to use:

```
sam package \
    --template-file template.yaml \
    --output-template-file packaged.yaml \
    --s3-bucket planning-poker-app

sam deploy \
    --template-file packaged.yaml \
    --stack-name planning-poker-app \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides MyParameterSample=MySampleValue

aws cloudformation describe-stacks \
    --stack-name planning-poker-app --query 'Stacks[].Outputs'
```


## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.
