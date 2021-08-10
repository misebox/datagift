#!/bin/bash

[ -f tmp/output ] && rm tmp/output
aws lambda invoke --function-name ${LAMBDA_FUNC_NAME} \
  --payload file://<(cat event-local.json | base64 -w 0) \
  tmp/output
echo "---- RAW Response from lambda"
cat tmp/output | jq .
echo "---- Response Body"
cat tmp/output | jq -r .body | jq .

