#!/bin/bash
echo "Loading logs from land-local .."
if [ -z "$1" ]; then
  (cd modes/from-source && docker compose logs -f --since 1m)
else
  echo "Logs from $1:"
  (cd modes/from-source && docker compose logs $1 -f)
fi
