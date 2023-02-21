# Determine the location of the system's trust store
if [[ $(uname) == "Linux" ]]; then
  TRUST_STORE_DIR="/usr/local/share/ca-certificates"
  TRUST_STORE_CMD="sudo update-ca-certificates"
elif [[ $(uname) == "Darwin" ]]; then
  TRUST_STORE_DIR="/etc/openssl/certs"
  TRUST_STORE_CMD="sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain"
fi

# Check if one of the following files exists: modules/caddy/certs/, modules/caddy-src/certs/, modules/caddy/certs/, modules/caddy-src/certs/
if [ -f modules/caddy/certs/ca.crt ] || [ -f modules/caddy-src/certs/ca.crt ] || [ -f modules/caddy/certs/ca.crt ] || [ -f modules/caddy-src/certs/ca.crt ]; then

  echo "Removing CA certificate from the system's trust store..."

  # remove the cert from the trust store
  sudo rm "${TRUST_STORE_DIR}/ca.crt"

  echo "Removing CA certificate from the modules/caddy/certs/ and modules/caddy-src/certs/ directories..."

  # delete the cert from the modules/caddy/certs/ and modules/caddy-src/certs/ directories
  rm -f modules/caddy/certs/ca.crt
  rm -f modules/caddy-src/certs/ca.crt
  rm -f modules/caddy/certs/ca.key
  rm -f modules/caddy-src/certs/ca.key
fi
