# Circles UBI local development environment (land)
This is a docker compose setup for local development of the Circles UBI platform. It consists of the following services:
* api-server
* blockchain-indexer
* pathfinder2
* pathfinder2-updater
* pathfinder-proxy
* ganache
* postgres

__*Note*__: This setup is not meant to be used in production. 
            It is only meant for local development and uses default addresses, keys and passwords.

## Images and Dockerfiles
Most of the images used in this setup are built from Dockerhub. However, some of them are built from the source code in this repository: 
* api-db-init
* indexer-db-init
* other-blockchain-user
* ganache  

This is because the above images all need initialization before they can be used. 

### api-db-init
This image is used to initialize the database for the api-server. It contains a 'ssed.sh' script which downloads the 
api-server repository and applies the db-migrations to the api-db.

### indexer-db-init
This image is used to initialize the database for the blockchain-indexer. It contains a 'ssed.sh' script which 
downloads the blockchain-indexer repository and applies the db-migrations to the indexer-db.

### other-blockchain-user
This image is used to simulate other users on the blockchain. This is necessary because the pathfinder2-updater listens 
to the blockchain-indexer's websocket and only (re)seeds the pathfinder when a new transaction was indexed.  
In turn, the availability of the pathfinder-proxy depends on the pathfinder2-updater's healthcheck (which will be unhealthy
when it didn't receive a new transaction for a while).

### ganache
This image runs a ganache instance with all circles contracts pre-deployed.

## Port mappings
The docker compose maps the following services by default:
* api-server: 8989
* blockchain-indexer: 8675
* ganache: 8545
* api-db: 5432
* indexer-db: 5433
* pathfinder-proxy: 8080

## Preparation
Before you run the setup for the first time, you need to install the dependencies of the 'other-blockchain-user' image.
```bash
cd modules/other-blockchain-user
npm install
cd ../..
```

## Running the setup
To run the setup, simply run `docker-compose up` in the root directory of this repository. This will start all services and
initialize the databases. On the first run, it might take up to a few minutes until the api-server is ready to accept requests.

### Runtime state
All volumes are mounted to the `.state` directory in the root of this repository. This means that the state of the setup
will be persisted between runs. If you want to start from scratch, run the following command.
```
docker compose down \
 && sudo rm -r -f .state \
 && docker compose build --no-cache api-db-init indexer-db-init other-blockchain-user ganache \
 && docker compose up
```
