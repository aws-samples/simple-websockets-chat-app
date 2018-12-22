```
    _____  _                   _               _____      _                
   |  __ \| |                 (_)             |  __ \    | |               
   | |__) | | __ _ _ __  _ __  _ _ __   __ _  | |__) |__ | | _____ _ __    
   |  ___/| |/ _` | '_ \| '_ \| | '_ \ / _` | |  ___/ _ \| |/ / _ \ '__|   
   | |    | | (_| | | | | | | | | | | | (_| | | |  | (_) |   <  __/ |      
   |_|    |_|\__,_|_| |_|_| |_|_|_| |_|\__, | |_|   \___/|_|\_\___|_|      
                                        __/ |                              
                                       |___/                               
```

# API

This is the code and template for the simple-websocket-chat-app.  There are three functions 
contained within the directories and a SAM template that wires them up to a DynamoDB table 
and provides the minimal set of permissions needed to run the app:

```
.
├── README.md                   <-- This instructions file
├── onConnect                   <-- Source code onConnect
├── onDisconnect                <-- Source code onDisconnect
├── sendMessage                 <-- Source code sendMessage
└── template.yaml               <-- SAM template for Lambda Functions and DDB
```

## AWS CLI commands

Install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) 
and use it to package, deploy, and describe your application.  These are the commands you'll need to use:

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