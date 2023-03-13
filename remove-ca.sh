#!/bin/bash

echo "Removing mkcert CA"
mkcert -uninstall
rm -r -f "$(mkcert -CAROOT)"

echo "Removing Caddy CA"
rm -r -f modules/caddy/ca-certs
rm -r -f modules/caddy-src/ca-certs
