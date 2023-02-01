#!/bin/bash
git clone https://github.com/CirclesUBI/blockchain-indexer.git
cd blockchain-indexer
git checkout dev

export CONNECTION_STRING_ROOT="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

for i in {1..3}; do ((ls CirclesLand.BlockchainIndexer/DbMigrations/*.sql | xargs -I% sh -c 'psql ${CONNECTION_STRING_ROOT} << envsubst < %') && break) || sleep 10; done

cd ..
rm -r -f blockchain-indexer
