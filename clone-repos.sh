#!/bin/sh

cd ..

# If o-platform doesn't exist, clone it
if [ ! -d "o-platform" ]; then
  git clone https://github.com/CirclesUBI/o-platform.git
fi

# same with api-server
if [ ! -d "api-server" ]; then
  git clone https://github.com/CirclesUBI/api-server.git
fi

# same with blockchain-indexer
if [ ! -d "blockchain-indexer" ]; then
  git clone https://github.com/CirclesUBI/blockchain-indexer.git
fi

# same with pathfinder2
if [ ! -d "pathfinder2" ]; then
  git clone https://github.com/CirclesUBI/pathfinder2.git
fi

# same with pathfinder2-updater
if [ ! -d "pathfinder2-updater" ]; then
  git clone https://github.com/CirclesUBI/pathfinder2-updater.git
fi

# same with pathfinder-proxy
if [ ! -d "pathfinder-proxy" ]; then
  git clone https://github.com/CirclesUBI/pathfinder-proxy.git
fi

cd land-local