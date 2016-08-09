#!/bin/bash

babel src --out-dir dist

pushd dist

cp ../package.json ./
npm install --production

zip -r function.zip ./*

aws lambda update-function-code \
  --function-name gif-thumbnail \
  --zip-file fileb://`pwd`/function.zip \
  | jq

popd dist
