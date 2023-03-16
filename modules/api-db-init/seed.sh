#!/bin/bash
export POSTGRES_USER
export POSTGRES_DB
export CONNECTION_STRING_ROOT="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

node /app/generate_key_phrase.js

file_path="/app/status/addresses.json"

if [ -f "$file_path" ]; then
    echo "Using addresses from $file_path:"
    INITIAL_USER_SAFE_ADDRESS=$(jq -r '.rootSafeContract' "$file_path")
    INITIAL_USER_SAFE_OWNER_ADDRESS=$(jq -r '.defaultOwnerAccount.address' "$file_path")
    INITIAL_ORG_SAFE_ADDRESS=$(jq -r '.operatorOrgaSafeContract' "$file_path")
    INITIAL_ORG_SAFE_OWNER_ADDRESS=$(jq -r '.defaultOwnerAccount.address' "$file_path")

    echo "INITIAL_USER_SAFE_ADDRESS: ${INITIAL_USER_SAFE_ADDRESS}"
    echo "INITIAL_USER_SAFE_OWNER_ADDRESS: ${INITIAL_USER_SAFE_OWNER_ADDRESS}"
    echo "INITIAL_ORG_SAFE_ADDRESS: ${INITIAL_ORG_SAFE_ADDRESS}"
    echo "INITIAL_ORG_SAFE_OWNER_ADDRESS: ${INITIAL_ORG_SAFE_OWNER_ADDRESS}"

    USER_COUNTER=1

    for ADDRESS in $(jq -r '.otherSafes[]' $file_path); do
        NAME="Person_${USER_COUNTER}"
        USER_COUNTER=$((USER_COUNTER+1))
        OWNER=$(jq -r '.defaultOwnerAccount.address' $file_path)
        echo "select add_seed_user('$ADDRESS', '$OWNER', '$NAME');" >> ./seed_users.sql
    done

    for ADDRESS in $(jq -r '.otherOrgaSafes[]' $file_path); do
        NAME="Organization_${USER_COUNTER}"
        USER_COUNTER=$((USER_COUNTER+1))
        OWNER=$(jq -r '.defaultOwnerAccount.address' $file_path)
        echo "select add_seed_org('$ADDRESS', '$OWNER', '$NAME');" >> ./seed_organizations.sql
    done

else
  echo "Using addresses from environment variables:"
  echo "INITIAL_USER_SAFE_ADDRESS: ${INITIAL_USER_SAFE_ADDRESS}"
  echo "INITIAL_USER_SAFE_OWNER_ADDRESS: ${INITIAL_USER_SAFE_OWNER_ADDRESS}"
  echo "INITIAL_ORG_SAFE_ADDRESS: ${INITIAL_ORG_SAFE_ADDRESS}"
  echo "INITIAL_ORG_SAFE_OWNER_ADDRESS: ${INITIAL_ORG_SAFE_OWNER_ADDRESS}"
fi

export INITIAL_USER_SAFE_ADDRESS
export INITIAL_USER_SAFE_OWNER_ADDRESS
export INITIAL_ORG_SAFE_ADDRESS
export INITIAL_ORG_SAFE_OWNER_ADDRESS
export INITIAL_USER_NAME;
export INITIAL_USER_EMAIL;
export APP_URL;

USE_LOCAL_SOURCE=0

if [ -f /app/.ready ]; then
  echo "Database already initialized"
else
  # Use the local source if available, else clone the repository
  if [ -d "./api-server" ]; then
    USE_LOCAL_SOURCE=1
    echo "api-server directory already exists. using local source."
    cd ./api-server
  else
    git clone https://github.com/CirclesUBI/api-server.git
    cd api-server
    git checkout dev
  fi

  ls src/api-db-migrations/*.sql | xargs -I% sh -c 'psql ${CONNECTION_STRING_ROOT} << envsubst < %'

  cd ..

  # if not using local source, remove the api-server directory
  [ $USE_LOCAL_SOURCE -eq 0 ] && rm -r -f api-server

  envsubst < ./initial_user.sql > ./initial_user.tmp.sql
  rm -f ./initial_user.sql
  mv ./initial_user.tmp.sql ./initial_user.sql

  echo "Executing initial_business_categories.sql"
  psql ${CONNECTION_STRING_ROOT} < ./initial_business_categories.sql
  echo "Executing insert_persons.sql"
  psql ${CONNECTION_STRING_ROOT} < ./insert_persons.sql
  echo "Executing insert_organizations.sql"
  psql ${CONNECTION_STRING_ROOT} < ./insert_organizations.sql
  echo "Executing initial_user.sql"
  psql ${CONNECTION_STRING_ROOT} < ./initial_user.sql
  echo "Executing seed_users.sql"
  psql ${CONNECTION_STRING_ROOT} < ./seed_users.sql
  echo "Executing seed_organizations.sql"
  psql ${CONNECTION_STRING_ROOT} < ./seed_organizations.sql

  psql --tuples-only -c "select p.\"firstName\" as name, j.hash from \"Profile\" p join \"Job\" j on p.\"inviteTriggerId\" = j.id where p.\"firstName\" like 'Person_%';" $CONNECTION_STRING_ROOT | while read name hash; do
    # Generate QR code for hash
    hash=$(echo "$hash" | sed -e 's/^[[:space:]]*|[[:space:]]*//')
    qrencode -s 10 -m 14 -o "/public/${name}.png" "https://api-server.circlesubi.localhost/trigger?hash=${hash}"
    echo "QR code saved to ${name}.png"

    ffmpeg -loop 1 -i "/public/${name}.png" -pix_fmt yuv420p -crf 30 -t 1 "/public/${name}.y4m"
  done

  # cp $file_path /public/addresses.json

  touch /app/.ready
fi

# Wait until a SIGTERM
trap "echo received SIGTERM && exit 0" SIGTERM
while true; do
  sleep 1
done
