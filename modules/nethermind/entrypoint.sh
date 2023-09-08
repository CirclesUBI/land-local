#!/bin/sh

apt update
apt install -y curl

exec /nethermind/Nethermind.Runner \
  --config ${NETHERMIND_CONFIG} \  
  $EXTRA_OPTS