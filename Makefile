#!make

include .env

package: check-vars
	sam package \
	--profile $(AWS_PROFILE) \
	--template-file template.yaml \
	--output-template-file packaged.yaml \
	--s3-bucket $(DEPLOY_BUCKET)

deploy: check-vars
	sam deploy \
		--profile $(AWS_PROFILE) \
		--stack-name=$(STACK_NAME) \
		--template-file packaged.yaml \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides TableName=$(TABLE_NAME) \
		--s3-bucket $(DEPLOY_BUCKET)

describe: check-vars
	aws cloudformation describe-stacks \
		--profile $(AWS_PROFILE) \
		--stack-name=$(STACK_NAME) \
		--query 'Stacks[].Outputs'

# Environment variables check
guard-%:
	@ if [ "${${*}}" = "" ]; then \
			echo "Please set $* in your .env file"; \
			exit 1; \
	fi

check-vars: guard-AWS_PROFILE guard-STACK_NAME guard-DEPLOY_BUCKET guard-TABLE_NAME
	@echo All env vars set

.PHONY: check-vars
