#!make

include .env

AWS = AWS_ACCESS_KEY_ID= AWS_PROFILE=$(AWS_PROFILE) aws
SAM = AWS_ACCESS_KEY_ID= AWS_PROFILE=$(AWS_PROFILE) sam

create-deploy-bucket: check-vars
	@$(AWS) s3 mb s3://$(DEPLOY_BUCKET)
	
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

check-vars: guard-AWS_PROFILE guard-STACK_NAME guard-DEPLOY_BUCKET guard-TABLE_NAME guard-WEBSITE_BUCKET
	@echo All env vars set

.PHONY: check-vars sam-package sam-deploy describe
