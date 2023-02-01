#!/bin/bash
export IP_ADDRESS=$(ip route get 1 | sed 's/^.*src \([^ ]*\).*$/\1/;q')
docker compose build --no-cache frontend
