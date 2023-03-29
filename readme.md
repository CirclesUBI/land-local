# Circles.land development environment
This repository bundles all components of the circles.land server and client software
in a Docker Compose environment that you can use for development on your local machine.

__*Note*__: This setup is not meant to be used in production.
It uses unsecure default addresses, keys and passwords.

It starts the following services/containers:

| Repo                                                                     | Service               | Description                                                                              |
|--------------------------------------------------------------------------|-----------------------|------------------------------------------------------------------------------------------|
| [caddy](https://hub.docker.com/_/caddy)                                  | frontend-proxy        | A tls-terminating reverse proxy for the 'frontend' and the 'api-server'                  |
| [o-platform](https://github.com/CirclesUBI/o-platform)                   | frontend              | The svelte based frontend application of circles.land                                    |
| [api-server](https://github.com/CirclesUBI/api-server)                   | api-server            | Provides access to all services trough a GraphQL api                                     |
| [blockchain-indexer](https://github.com/CirclesUBI/blockchain-indexer)   | blockchain-indexer    | Indexes circles related on-chain events and writes them to a postgres db                 |
| [pathfinder2](https://github.com/CirclesUBI/pathfinder2)                 | pathfinder2           | Finds transitive payment paths between untrusted users                                   | 
| [pathfinder2-updater](https://github.com/CirclesUBI/pathfinder2-updater) | pathfinder2-updater   | Updates the 'pathfinder2' with data from the 'blockchain-indexer'                        | 
| [pathfinder-proxy](https://github.com/CirclesUBI/pathfinder-proxy)       | pathfinder-proxy      | Maintains statistics, load balances and filters requests to the 'pathfinder2'            |
| [land-local](https://github.com/CirclesUBI/land-local)                   | api-db-init           | Executes the database migrations before each start of the api-server                     |
| [land-local](https://github.com/CirclesUBI/land-local)                   | indexer-db-init       | Executes the database migrations before each start of the blockchain-indexer             |
| [land-local](https://github.com/CirclesUBI/land-local)                   | ganache-init          | Executes the truffle migrations before each start of the api-server or blockchain-indexer |
| [land-local](https://github.com/CirclesUBI/land-local)                   | other-blockchain-user | Simulates usage from other users on the 'ganache' chain                                  |
| [minio](https://hub.docker.com/r/minio/minio)                            | minio                 | Provides a S3-compatible object storage                                                  |
| [o-platform-cypress](https://github.com/CirclesUBI/o-platform-cypress)   | cypress-tests         | End to end tests                                                                         |

Here is a graph of the startup dependencies of the services as found in the docker-compose files:  

![docker compose service startup dependencies](docs/diagrams/out/startup-dependencies.png)

## Modes
This repository contains two different docker-compose.yml files:
* /modes/__from-image__/docker-compose.yml
* /modes/__from-source__/docker-compose.yml

### from-image
Use this mode if you need an environment for testing or developing your own code
that uses the circles.land api. This mode uses the published images from 
dockerhub as configured in the /modes/from-image/docker-compose.yml file.

### from-source
Use this mode if you want to make changes to the circles.land codebase.  

In this mode, the frontend and the api-server are compiled from the local source code on your machine.
Then the webpack server and nodemon are used to serve the application and watch for changes.
All other services use the images from dockerhub. The services for this mode are defined 
in the /modes/from-source/docker-compose.yml file.

___Note:___ This mode assumes you cloned the repos into the following FS-hierarchy:  
* ../
  * o-platform/
  * api-server/
  * blockchain-indexer/
  * pathfinder2/
  * pathfinder2-updater/
  * pathfinder-proxy/
  * o-platform-cypress/
  
_You can run `./clone-repos.sh` to clone all repos into the parent directory._

## Usage
### Preparation
#### Install dependencies
_Ubuntu_:  
1) Install [docker](https://docs.docker.com/engine/install/ubuntu/) and [docker compose](https://docs.docker.com/compose/install/linux/).
2) Install git and mkcert: ```sudo apt install git libnss3-tools mkcert```  

_MacOS_:
1) Install Docker Desktop for Mac: https://docs.docker.com/docker-for-mac/install/
1) Install the xcode command line tools (open the Terminal and type 'git' + Enter)
2) Install [homebrew](https://brew.sh/) and follow the instructions to add it to your $PATH.
3) Install mkcert with homebrew: ```brew install nss mkcert```

#### Clone repository
The 'land-local' repository should be cloned into the following FS-hierarchy:
* CirclesUBI/
  * land-local/

```shell
mkdir CirclesUBI
cd CirclesUBI
git clone https://github.com/CirclesUBI/land-local.git
```

### Run the stack
```shell
cd land-local
./start.sh
```  
Then access https://static.circlesubi.localhost/ in your browser.

_The first start will take a long time so get yourself a coffee or tea._

### Stop the stack
Run `./stop.sh` to stop the stack. If you want to remove the CA, run `./remove-ca.sh`.  

### Other commands
#### Lifecycle
* To kill all containers, remove the certificates and rebuild the stack, run `./reset.sh`.  
* To kill, rebuild and restart a single container, run `./rebuild.sh <container-name>`.
#### Logs
* To show the logs of a single container, run `./logs.sh <container-name>`.
* To show the full docker-compose logs, run `./logs.sh`.

### How to Override api-server and frontend for local debugging
1. run the docker as described above
2. stop the api-server and frontend container
3. make sure you have the launch.json (for Visual Studio Code) from secrets.circlesubi.id and it contains the correct API Keys
4. start the api inside your Visual Studio
5. in o-platform make sure you have the .env.override file from secrets.circlesubi.id
6. go to o-platform/shell and type: yarn override to start the frontend.

### Access the UI
#### Dashboard
Use Firefox or Chrome and visit https://static.circlesubi.localhost/.

1. First visit https://api-server.circlesubi.localhost and accept the self-signed certificate
2. To login, visit https://o-platform.circlesubi.localhost/#/passport/actions/login/0 and accept the self-signed certificate
3. Set a PIN
4. Complete the survey
5. Scan the invite code from http://localhost:1234/Person_1.png and click "Next"
6. Click "Sign-up now"
7. Click "Sign-up now" again
8. When asked if you want to import or create a new account, click "Import existing"
9. Copy the keyphrase from http://localhost:1234/key_phrase.txt into the textbox and click "Connect recovery code"
10. Select one of the safes which name starts with "Person_" and click "Connect"
11. Next, click "Proceed"
12. Finished. You should now see the dashboard at https://o-platform.circlesubi.localhost/#/home
