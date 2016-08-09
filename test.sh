#!/bin/bash

aws lambda invoke \
  --invocation-type RequestResponse \
  --function-name gif-thumbnail \
  --region us-east-1 \
  --log-type Tail \
  --payload "$(cat ./test.json)" \
  /tmp/gif-thumbnail.log | jq -r '.LogResult' | base64 --decode

jq < /tmp/gif-thumbnail.log
