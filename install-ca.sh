#!/bin/bash

# Check if openssl is installed
command -v openssl >/dev/null 2>&1 || \
  { echo >&2 "openssl is required but it's not installed. Aborting."; exit 1; }

# Generate a unique CA certificate and private key
openssl req \
        -x509 \
        -new \
        -nodes \
        -keyout ca.key \
        -out ca.crt \
        -subj "/CN=MyCA-$(date +%Y%m%d%H%M%S)" \
        -days 3650

# Determine the location of the system's trust store
if [[ $(uname) == "Linux" ]]; then
    TRUST_STORE_DIR="/usr/local/share/ca-certificates"
    TRUST_STORE_CMD="sudo update-ca-certificates"
elif [[ $(uname) == "Darwin" ]]; then
    TRUST_STORE_DIR="/etc/openssl/certs"
    TRUST_STORE_CMD="sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain"
fi

# Copy the CA certificate to the system's trust store
sudo cp ca.crt "${TRUST_STORE_DIR}/"
sudo ${TRUST_STORE_CMD}

# Copy the certificate and private key to 'modeules/caddy/certs' and 'modules/caddy-src/certs'
# Create the directories if they don't exist
mkdir -p modules/caddy/certs
mkdir -p modules/caddy-src/certs
cp ca.crt modules/caddy/certs/
cp ca.crt modules/caddy-src/certs/
cp ca.key modules/caddy/certs/
cp ca.key modules/caddy-src/certs/
