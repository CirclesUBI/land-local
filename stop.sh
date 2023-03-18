#!/bin/bash
if [[ "$1" == "kill" ]]; then
  (cd modes/from-source && docker compose kill)
else
  (cd modes/from-source && docker compose stop)
fi
