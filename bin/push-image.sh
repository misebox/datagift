#!/bin/bash
set -eux

: IMAGE_TAG=${IMAGE_TAG}
: ECR_REPO_NAME=${ECR_REPO_NAME}

REGION=$(aws configure get region)
ACCOUNTID=$(aws sts get-caller-identity --output text --query Account)
ECR_BASE_URI=${ACCOUNTID}.dkr.ecr.${REGION}.amazonaws.com
ECR_IMAGE_URI=${ECR_BASE_URI}/${ECR_REPO_NAME}


aws ecr get-login-password | docker login --username AWS --password-stdin ${ECR_BASE_URI}
docker build -t ${IMAGE_TAG} lambda
docker tag ${IMAGE_TAG}:latest ${ECR_IMAGE_URI}:latest
docker push ${ECR_IMAGE_URI}:latest

