# simple-websockets-chat-app

This is the template for simple-websocket-chat-app - Below is a brief explanation of what we have generated for you:

```
.
├── README.md                   <-- This instructions file
├── onConnect                   <-- Source code onConnect
├── onDisconnect                <-- Source code onDisconnect
├── sendMessage                 <-- Source code sendMessage
└── template.yaml               <-- SAM template for Lambda Functions and DDB
```


# Deploying on your account

## AWS CLI commands

AWS CLI commands to package, deploy and describe outputs defined within the cloudformation stack:

```
sam package \
    --template-file template.yaml \
    --output-template-file packaged.yaml \
    --s3-bucket REPLACE_THIS_WITH_YOUR_S3_BUCKET_NAME

sam deploy \
    --template-file packaged.yaml \
    --stack-name simple-websocket-chat-app \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides MyParameterSample=MySampleValue

aws cloudformation describe-stacks \
    --stack-name simple-websocket-chat-app --query 'Stacks[].Outputs'
```


## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.