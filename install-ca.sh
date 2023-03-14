#!/bin/bash

if [[ "$OSTYPE" == "darwin"* ]]; then
  brew install nss
else
  echo "Please install libnss3-tools"
  exit 1
fi

if [[ -f ~/.asdf/asdf.sh ]]; then
  echo "asdf already installed"
else
  brew install coreutils curl git
  git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.11.2
  echo '. "$HOME/.asdf/asdf.sh"' >> ~/.zshrc
  echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.zshrc
  source ~/.zshrc
fi

asdf plugin-add mkcert
asdf install mkcert latest
asdf global mkcert latest

ROOT_CA_PATH=~/Library/Application\ Support/mkcert
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  ROOT_CA_PATH=~/.local/share/mkcert
fi

if [[ -f $ROOT_CA_PATH/rootCA-key.pem ]] && [[ -f $ROOT_CA_PATH/rootCA.pem ]]; then
  echo "mkcert -install already ran"
else
  mkcert -install
  # copy the cert to the modules/caddy/ca-certs/ and modules/caddy-src/ca-certs/ directories
  mkdir -p modules/caddy/ca-certs
  cp -f "$ROOT_CA_PATH/rootCA.pem" modules/caddy/ca-certs/ca.crt
  cp -f "$ROOT_CA_PATH/rootCA-key.pem" modules/caddy/ca-certs/ca.key

  mkdir -p modules/caddy-src/ca-certs
  cp -f "$ROOT_CA_PATH/rootCA.pem" modules/caddy-src/ca-certs/ca.crt
  cp -f "$ROOT_CA_PATH/rootCA-key.pem" modules/caddy-src/ca-certs/ca.key

  echo "mkcert -install successful"
fi
