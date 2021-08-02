#!/bin/bash

cd ui
npm run build
aws s3 cp dist/ s3://datagift-web/ --recursive
