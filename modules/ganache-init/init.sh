#!/bin/bash

cd truffle && npx truffle deploy
cd ../seed-data && node run.js
cat /app/status/addresses.json

# Wait until a SIGTERM
trap "echo received SIGTERM && exit 0" SIGTERM
while true; do
  sleep 1
done
