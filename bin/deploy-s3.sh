#!/bin/bash

cd ui
npm run build
aws s3 cp dist/ s3://datagift-web/ --recursive

# aws cloudfront create-invalidation \
#   --distribution-id "${DISTRIBUTION_ID}" \
#   --paths '/index.html'
