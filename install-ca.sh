#!/bin/bash

ROOT_CA_PATH=~/.local/share/mkcert
if [[ "$OSTYPE" == "darwin"* ]]; then
  ROOT_CA_PATH=~/Library/Application\ Support/mkcert
fi

if [[ -f $ROOT_CA_PATH/rootCA-key.pem ]] && [[ -f $ROOT_CA_PATH/rootCA.pem ]]; then
  echo "mkcert -install already ran"
else
  mkcert -install
  echo "mkcert -install successful"
fi

mkdir -p modules/caddy/ca-certs
cp -f "$ROOT_CA_PATH/rootCA.pem" modules/caddy/ca-certs/ca.crt
cp -f "$ROOT_CA_PATH/rootCA-key.pem" modules/caddy/ca-certs/ca.key

mkdir -p modules/caddy-src/ca-certs
cp -f "$ROOT_CA_PATH/rootCA.pem" modules/caddy-src/ca-certs/ca.crt
cp -f "$ROOT_CA_PATH/rootCA-key.pem" modules/caddy-src/ca-certs/ca.key
