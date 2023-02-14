#!/bin/bash
export POSTGRES_USER
export POSTGRES_DB
export CONNECTION_STRING_ROOT="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

file_path='/app/status/addresses.json'

if [ -f "$file_path" ]; then
  echo "Using addresses from $file_path:"
  INITIAL_USER_SAFE_ADDRESS=$(jq -r '.rootSafeContract' "$file_path")
  INITIAL_USER_SAFE_OWNER_ADDRESS=$(jq -r '.defaultOwnerAccount.address' "$file_path")
  INITIAL_ORG_SAFE_ADDRESS=$(jq -r '.operatorOrgaSafeContract' "$file_path")
  INITIAL_ORG_SAFE_OWNER_ADDRESS=$(jq -r '.defaultOwnerAccount.address' "$file_path")
  echo "INITIAL_USER_SAFE_ADDRESS: $INITIAL_USER_SAFE_ADDRESS"
  echo "INITIAL_USER_SAFE_OWNER_ADDRESS: $INITIAL_USER_SAFE_OWNER_ADDRESS"
  echo "INITIAL_ORG_SAFE_ADDRESS: $INITIAL_ORG_SAFE_ADDRESS"
  echo "INITIAL_ORG_SAFE_OWNER_ADDRESS: $INITIAL_ORG_SAFE_OWNER_ADDRESS"
else
  echo "Using addresses from environment variables:"
  echo "INITIAL_USER_SAFE_ADDRESS: $INITIAL_USER_SAFE_ADDRESS"
  echo "INITIAL_USER_SAFE_OWNER_ADDRESS: $INITIAL_USER_SAFE_OWNER_ADDRESS"
  echo "INITIAL_ORG_SAFE_ADDRESS: $INITIAL_ORG_SAFE_ADDRESS"
  echo "INITIAL_ORG_SAFE_OWNER_ADDRESS: $INITIAL_ORG_SAFE_OWNER_ADDRESS"
fi

export INITIAL_USER_SAFE_ADDRESS
export INITIAL_USER_SAFE_OWNER_ADDRESS
export INITIAL_ORG_SAFE_ADDRESS
export INITIAL_ORG_SAFE_OWNER_ADDRESS
export INITIAL_USER_NAME;
export INITIAL_USER_EMAIL;
export APP_URL;

if [ -f /app/.ready ]; then
  echo "Database already initialized"
else
  git clone https://github.com/CirclesUBI/api-server.git
  cd api-server
  git checkout dev

  ls src/api-db-migrations/*.sql | xargs -I% sh -c 'psql ${CONNECTION_STRING_ROOT} << envsubst < %'

  cd ..
  rm -r -f api-server

  envsubst < ./initial_user.sql > ./initial_user.tmp.sql
  rm -f ./initial_user.sql
  mv ./initial_user.tmp.sql ./initial_user.sql

  psql ${CONNECTION_STRING_ROOT} < ./initial_business_categories.sql
  psql ${CONNECTION_STRING_ROOT} < ./initial_user.sql
  psql ${CONNECTION_STRING_ROOT} < ./initial_businesses.sql

  touch /app/.ready
fi

# Wait until a SIGTERM
trap "echo received SIGTERM && exit 0" SIGTERM
while true; do
  sleep 1
done
