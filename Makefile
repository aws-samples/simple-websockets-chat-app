#!make

include .env

AWS = AWS_ACCESS_KEY_ID= AWS_PROFILE=$(AWS_PROFILE) aws
SAM = AWS_ACCESS_KEY_ID= AWS_PROFILE=$(AWS_PROFILE) sam

create-deploy-bucket: check-vars
	@$(AWS) s3 mb s3://$(DEPLOY_BUCKET)
	
local-start: check-local-vars
	docker-compose up -d

local-stop:
	docker-compose down

create-table: check-local-vars
	@echo deleting $(TABLE_NAME)
	-$(AWS) dynamodb delete-table \
		--endpoint-url http://localhost:$(LOCAL_DYNAMODB_PORT) \
    --table-name $(TABLE_NAME)
	$(AWS) dynamodb create-table \
		--endpoint-url http://localhost:$(LOCAL_DYNAMODB_PORT) \
    --table-name $(TABLE_NAME) \
    --attribute-definitions AttributeName=roomId,AttributeType=S AttributeName=connectionId,AttributeType=S \
    --key-schema AttributeName=roomId,KeyType=HASH AttributeName=connectionId,KeyType=RANGE \
    --global-secondary-indexes IndexName=connectionId,KeySchema=["{AttributeName=connectionId,KeyType=HASH}"],Projection={ProjectionType=KEYS_ONLY},ProvisionedThroughput="{ReadCapacityUnits=1,WriteCapacityUnits=1}" \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

call-%: check-local-vars
	$(SAM) local invoke $(*)Function \
		--parameter-overrides TableName=$(TABLE_NAME) \
				LocalDynamodbEndpoint=$(LOCAL_DYNAMODB_ENDPOINT) \
		--event test/$(*)Event.json

sam-package: check-vars
	$(SAM) package \
	--template-file template.yaml \
	--output-template-file packaged.yaml \
	--s3-bucket $(DEPLOY_BUCKET)

sam-deploy: check-vars
	$(SAM) deploy \
		--stack-name=$(STACK_NAME) \
		--template-file packaged.yaml \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides TableName=$(TABLE_NAME) \
				WebsiteBucketName=$(WEBSITE_BUCKET) \
		--s3-bucket $(DEPLOY_BUCKET)

website-deploy: check-vars
	$(AWS) s3 sync --acl "public-read" ./website s3://$(WEBSITE_BUCKET)

stack-describe: check-vars
	$(AWS) cloudformation describe-stacks \
		--stack-name=$(STACK_NAME) \
		--query 'Stacks[].Outputs'
	
deploy: 
	make sam-package
	make sam-deploy
	make stack-describe
	make website-deploy

# Environment variables check
guard-%:
	@ if [ "${${*}}" = "" ]; then \
			echo "Please set $* in your .env file"; \
			exit 1; \
	fi

check-vars:
	@make guard-AWS_PROFILE
	@make guard-STACK_NAME
	@make guard-DEPLOY_BUCKET
	@make guard-TABLE_NAME
	@make guard-WEBSITE_BUCKET

check-local-vars:
	@make guard-STACK_NAME
	@make guard-TABLE_NAME
	@make guard-LOCAL_DYNAMODB_ENDPOINT
	@make guard-LOCAL_DYNAMODB_PORT

.PHONY: check-vars check-local-vars sam-package sam-deploy stack-describe
