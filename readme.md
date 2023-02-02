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
* ganache-init

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

### ganache-init
This image is used to initialize the ganache instance. It contains a 'init.sh' script which deploys the circles contracts
and the first safe.

### frontend
Pulls the o-platform repository and builds the frontend. Then uses nginx to serve the svelte app.

## Port mappings
The docker compose maps the following services by default:
* api-server: 8989
* blockchain-indexer: 8675
* ganache: 8545
* api-db: 5432
* indexer-db: 5433
* pathfinder-proxy: 8081
* frontend: 8080

## Preparation
### execute run.sh
Please note, on MacOS change: export IP_ADDRESS=$(ip route get 1 | sed 's/^.*src \([^ ]*\).*$/\1/;q') to:
export IP_ADDRESS=$(route get 1 | sed 's/^.*src \([^ ]*\).*$/\1/;q')

### Install dependencies
Before you run the setup for the first time, you need to install the dependencies of the 'other-blockchain-user' image.
```bash
cd modules/other_chain_user
npm install
cd ../..
```

### Configure the initial user
Because the local environment comes with an own ganache chain, the existing safes and wallets are not available.
A new safe, key and profile hast to be created. This happens automatically in the initialization of the api-db (api-db-init) and ganache (ganache-init).  



## Running the setup
To run the setup, simply run `docker compose up` in the root directory of this repository. This will start all services and
initialize the databases. On the first run, it might take up to a few minutes until the api-server is ready to accept requests.
It will restart continuously until all dependencies are available. This is normal and will stop once all dependencies are available.

### Runtime state
All volumes are mounted to the `.state` directory in the root of this repository. This means that the state of the setup
will be persisted between runs. If you want to start from scratch, run the following commands.
```
docker compose down \
 && sudo rm -r -f .state \
 && docker compose build --no-cache api-db-init indexer-db-init other-blockchain-user ganache  ganache-init
docker compose up
```

## Developing using this setup
There are generally two ways to work with this setup:
* **Replace the images of the services you want to work on with your local version:**  
  You can either build the images locally or you pull your versions from a docker registry.
* **Change the configuration so that it points to a component you run on your machine:**  
  You can change the configuration of the other components to point to your local version of a component.
  E.g. if you want to work on the api-server, you can change the configuration of the frontend to point to your local 
  api-server. Your local api-server has to use the api-db, indexer-db, ganache, pathfinder, etc. from the docker compose setup.
  It might be necessary to create an entry in your hosts file to make it easier to resolve the local component from within
  the docker compose environment
