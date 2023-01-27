#!/bin/bash
export POSTGRES_USER
export POSTGRES_DB
export CONNECTION_STRING_ROOT="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

export INITIAL_USER_SAFE_ADDRESS;
export INITIAL_USER_SAFE_OWNER_ADDRESS;
export INITIAL_ORG_SAFE_ADDRESS;
export INITIAL_ORG_SAFE_OWNER_ADDRESS;
export INITIAL_USER_NAME;
export INITIAL_USER_EMAIL;
export APP_URL;

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
