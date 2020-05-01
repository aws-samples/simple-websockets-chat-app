# Notes

## Helpful Commands

### Validate Cognito User

aws cognito-idp admin-confirm-sign-up \
 --region us-east-1 \
 --user-pool-id us-east-1_trOLtav13 \
 --username chris@example.com

### Create Cognito User

aws cognito-idp sign-up --region us-east-1 --client-id 776gr1b1703hcbes2vnb0dq8pm --username admin@example.com --password Elm0andm3\$ --user-attributes [{"Name": "email","Value": "chlmes@amazon.com"}]

## TODO

- Create api login method that correlates connectionId to username and stores the data in DynamoDB
- Create session api method
  - Agent to method mapping
- Store Conversations in DynamoDB

- Session timeout
- Session timestamp

### DynamoDB

- What are all the active user sessions
