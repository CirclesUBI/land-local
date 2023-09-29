#!/bin/bash

# If /app/status/addresses.json not exists, then run the deployment
if [ ! -f /app/status/addresses.json ]; then

  # TODO: The commented out lines around only apply for ganache. Hardhat needs re-initialization every time.
  cd truffle && npx truffle deploy --verbose-rpc --describe-json 
  
  cd ../seed-data && node run.js
  
  # cd seed-data && npx ts-node --project tsconfig.json seed.ts
  #  && node run_test.js

  #  && npx ts-node --project tsconfig.json ts_test.ts
else
 echo "Nethermind already initialized" && cd seed-data && npx ts-node --project tsconfig.json seed.ts
fi

# Wait until a SIGTERM
trap "echo received SIGTERM && exit 0" SIGTERM
while true; do
  sleep 1
done
