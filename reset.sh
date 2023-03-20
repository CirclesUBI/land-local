#!/bin/bash
(cd modes/from-source && docker compose kill && docker compose down && sudo rm -r -f .state && docker compose build) && ./remove-ca.sh