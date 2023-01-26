#!/bin/bash
git clone https://github.com/CirclesUBI/api-server.git
cd api-server
git checkout dev

export CONNECTION_STRING_ROOT="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"
export POSTGRES_USER
export POSTGRES_DB

ls src/api-db-migrations/*.sql | xargs -I% sh -c 'psql ${CONNECTION_STRING_ROOT} << envsubst < %'

cd ..
rm -r -f api-server
