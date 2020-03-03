### Validate Cognito User
aws cognito-idp admin-confirm-sign-up \
  --region us-east-1 \
  --user-pool-id us-east-1_trOLtav13 \
  --username admin@example.com


### Create Cognito User
  aws cognito-idp sign-up   --region us-east-1   --client-id 776gr1b1703hcbes2vnb0dq8pm   --username admin@example.com   --password Elm0andm3$ --user-attributes [{"Name": "email","Value": "chlmes@amazon.com"}]