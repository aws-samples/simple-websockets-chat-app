#!/usr/bin/env bash

sam package     --template-file template.yaml     --output-template-file packaged.yaml     --s3-bucket chlmes.dump --region us-east-1
sam deploy     --template-file packaged.yaml     --stack-name simple-websocket-chat-app     --capabilities CAPABILITY_IAM --region us-east-1
sam logs --stack-name simple-websocket-chat-app -n RegisterFunction --region us-east-1 -t