#!/bin/bash

sudo apt-get install -y libnss3-tools
sudo apt-get install -y mkcert

if [[ -f ~/.local/share/mkcert/rootCA-key.pem ]] && [[ -f ~/.local/share/mkcert/rootCA.pem ]]; then
  echo "mkcert -install already ran"
else
  mkcert -install
  # copy the cert to the modules/caddy/ca-certs/ and modules/caddy-src/ca-certs/ directories
  mkdir -p modules/caddy/ca-certs
  cp -f ~/.local/share/mkcert/rootCA.pem modules/caddy/ca-certs/ca.crt
  cp -f ~/.local/share/mkcert/rootCA-key.pem modules/caddy/ca-certs/ca.key

  mkdir -p modules/caddy-src/ca-certs
  cp -f ~/.local/share/mkcert/rootCA.pem modules/caddy-src/ca-certs/ca.crt
  cp -f ~/.local/share/mkcert/rootCA-key.pem modules/caddy-src/ca-certs/ca.key

  echo "mkcert -install successful"
fi
