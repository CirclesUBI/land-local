#!/bin/bash

ROOT_CA_PATH=~/.local/share/mkcert
if [[ "$OSTYPE" == "darwin"* ]]; then
  ROOT_CA_PATH=~/Library/Application\ Support/mkcert
  brew install nss
fi

if [[ -f ~/.asdf/asdf.sh ]]; then
  echo "asdf already installed"
else
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install coreutils curl git
    git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.11.2
    echo '. "$HOME/.asdf/asdf.sh"' >> ~/.zshrc
    echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.zshrc
    source ~/.zshrc
  else
    echo "Please install 'asdf'"
  fi
fi

asdf plugin-add mkcert
asdf install mkcert latest
asdf global mkcert latest

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
