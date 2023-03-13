#!/bin/bash
./remove-ca.sh && (cd modes/from-source && docker compose kill && docker compose down && sudo rm -r -f .state && docker compose build)

