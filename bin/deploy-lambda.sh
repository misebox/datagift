#!/bin/bash
set -eux

: IMAGE_TAG=${IMAGE_TAG}
: ECR_REPO_NAME=${ECR_REPO_NAME}
: LAMBDA_FUNC_NAME=${LAMBDA_FUNC_NAME}

REGION=$(aws configure get region)
ACCOUNTID=$(aws sts get-caller-identity --output text --query Account)
ECR_BASE_URI=${ACCOUNTID}.dkr.ecr.${REGION}.amazonaws.com
ECR_IMAGE_URI=${ECR_BASE_URI}/${ECR_REPO_NAME}


aws ecr get-login-password | docker login --username AWS --password-stdin ${ECR_BASE_URI}
docker build -t ${IMAGE_TAG} lambda
docker tag ${IMAGE_TAG}:latest ${ECR_IMAGE_URI}:latest
docker push ${ECR_IMAGE_URI}:latest

DIGEST=$( \
  aws ecr list-images \
  --repository-name ${ECR_REPO_NAME} \
  --out text --query 'imageIds[?imageTag==`latest`].imageDigest'
)
aws lambda update-function-code \
  --function-name ${LAMBDA_FUNC_NAME} \
  --image-uri ${ECR_IMAGE_URI}@${DIGEST}
sleep 3
tmp/output && rm tmp/output
aws lambda invoke --function-name ${LAMBDA_FUNC_NAME} tmp/output ; cat tmp/output

echo
