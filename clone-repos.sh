#!/bin/sh

cd ..

# If o-platform doesn't exist, clone it
if [ ! -d "o-platform" ]; then
  git clone https://github.com/CirclesUBI/o-platform.git
  (cd o-platform && git branch --show-current && git checkout dev)
fi

# same with api-server
if [ ! -d "api-server" ]; then
  git clone https://github.com/CirclesUBI/api-server.git
  (cd api-server && git branch --show-current && git checkout dev)
fi

# same with blockchain-indexer
if [ ! -d "blockchain-indexer" ]; then
  git clone https://github.com/CirclesUBI/blockchain-indexer.git
  (cd blockchain-indexer && git branch --show-current && git checkout aarch64-compatible)
fi

# same with pathfinder2
if [ ! -d "pathfinder2" ]; then
  git clone https://github.com/CirclesUBI/pathfinder2.git
  (cd pathfinder2 && git branch --show-current && git checkout master)
fi

# same with pathfinder2-updater
if [ ! -d "pathfinder2-updater" ]; then
  git clone https://github.com/CirclesUBI/pathfinder2-updater.git
  (cd pathfinder2-updater && git branch --show-current && git checkout fix/dont-export-negative-balances)
fi

# same with pathfinder-proxy
if [ ! -d "pathfinder-proxy" ]; then
  git clone https://github.com/CirclesUBI/pathfinder-proxy.git
  (cd pathfinder-proxy && git branch --show-current && git checkout dev)
fi

# same with cypress-tests
if [ ! -d "cypress-tests" ]; then
  git clone https://github.com/CirclesUBI/o-platform-cypress.git
  (cd o-platform-cypress && git branch --show-current && git checkout feature/app-103-automated-e2e-testing-with-cypress)
fi

cd land-local
