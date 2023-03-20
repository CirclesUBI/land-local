#!/bin/sh
file_path='/app/status/addresses.json'

if [ -f "$file_path" ]; then
  echo "Using addresses from $file_path:"
  CIRCLES_HUB_ADDRESS=$(jq -r '.hubContract' "$file_path")
  OPERATOR_ORGANISATION_ADDRESS=$(jq -r '.operatorOrgaSafeContract' "$file_path")
  INVITATION_FUNDS_SAFE_ADDRESS=$(jq -r '.invitationFundsSafeContract' "$file_path")
  INVITATION_FUNDS_SAFE_KEY=$(jq -r '.defaultOwnerAccount.privateKey' "$file_path")
  echo "CIRCLES_HUB_ADDRESS: $CIRCLES_HUB_ADDRESS"
  echo "OPERATOR_ORGANISATION_ADDRESS: $OPERATOR_ORGANISATION_ADDRESS"
  echo "INVITATION_FUNDS_SAFE_ADDRESS: $INVITATION_FUNDS_SAFE_ADDRESS"
  echo "INVITATION_FUNDS_SAFE_KEY: $INVITATION_FUNDS_SAFE_KEY"
else
  echo "Using addresses from environment variables:"
  echo "CIRCLES_HUB_ADDRESS: $CIRCLES_HUB_ADDRESS"
  echo "OPERATOR_ORGANISATION_ADDRESS: $OPERATOR_ORGANISATION_ADDRESS"
  echo "INVITATION_FUNDS_SAFE_ADDRESS: $INVITATION_FUNDS_SAFE_ADDRESS"
  echo "INVITATION_FUNDS_SAFE_KEY: $INVITATION_FUNDS_SAFE_KEY"
fi

cd /usr/o-platform/api-server/dist
node /usr/o-platform/api-server/dist/main.js
