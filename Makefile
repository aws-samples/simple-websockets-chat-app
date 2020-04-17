#!make

include .env

sam-package: check-vars
	sam package \
	--profile $(AWS_PROFILE) \
	--template-file template.yaml \
	--output-template-file packaged.yaml \
	--s3-bucket $(DEPLOY_BUCKET)

sam-deploy: check-vars
	sam deploy \
		--profile $(AWS_PROFILE) \
		--stack-name=$(STACK_NAME) \
		--template-file packaged.yaml \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides TableName=$(TABLE_NAME) \
				WebsiteBucketName=$(WEBSITE_BUCKET) \
		--s3-bucket $(DEPLOY_BUCKET)

website-deploy: check-vars
	aws s3 sync --acl "public-read" ./website s3://$(WEBSITE_BUCKET) --profile $(AWS_PROFILE)

stack-describe: check-vars
	aws cloudformation describe-stacks \
		--profile $(AWS_PROFILE) \
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

check-vars: guard-AWS_PROFILE guard-STACK_NAME guard-DEPLOY_BUCKET guard-TABLE_NAME guard-WEBSITE_BUCKET
	@echo All env vars set

.PHONY: check-vars sam-package sam-deploy describe
