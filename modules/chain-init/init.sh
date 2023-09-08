#!/bin/bash

# If /app/status/addresses.json not exists, then run the deployment
#if [ ! -f /app/status/addresses.json ]; then

  # TODO: The commented out lines around only apply for ganache. Hardhat needs re-initialization every time.
  cd truffle && npx truffle deploy --verbose-rpc --describe-json --chain.networkId=0x63
  cd ../seed-data && node run.js
#else
#  echo "Ganache already initialized"
#fi

# Wait until a SIGTERM
trap "echo received SIGTERM && exit 0" SIGTERM
while true; do
  sleep 1
done
