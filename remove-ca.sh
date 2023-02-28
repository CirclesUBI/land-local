# Determine the location of the system's trust store
if [[ $(uname) == "Linux" ]]; then
  TRUST_STORE_DIR="/usr/local/share/ca-certificates"
  TRUST_STORE_CMD="sudo update-ca-certificates"
elif [[ $(uname) == "Darwin" ]]; then
  TRUST_STORE_DIR="/etc/openssl/certs"
  TRUST_STORE_CMD="sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain"
fi

# Check if one of the following directories exists: modules/caddy/certs/, modules/caddy-src/certs/ or file CERT_FILENAME_PREFIX
if [[ -d modules/caddy/ca-certs/ ]] || [[ -d modules/caddy-src/ca-certs/ ]] || [[ -f CERT_FILENAME_PREFIX ]]; then

  # Read the filename prefix from the CERT_FILENAME_PREFIX file
  FILENAME_PREFIX=$(cat CERT_FILENAME_PREFIX)

  echo "Removing CA certificate from the modules/caddy/certs/ and modules/caddy-src/certs/ directories..."

  # delete the cert from the modules/caddy/certs/ and modules/caddy-src/certs/ directories
  sudo rm -r -f modules/caddy/ca-certs
  sudo rm -r -f modules/caddy-src/ca-certs

  echo "Removing CA certificate from the system's trust store..."

  # Read the filename prefix from the CERT_FILENAME_PREFIX file
  FILENAME_PREFIX=$(cat CERT_FILENAME_PREFIX)

  # Remove the cert file from the system's trust store
  sudo rm "${TRUST_STORE_DIR}/${FILENAME_PREFIX}-ca.crt"
  sudo ${TRUST_STORE_CMD}

  sudo rm ca.crt
  sudo rm ca.key
  sudo rm CERT_FILENAME_PREFIX
fi
