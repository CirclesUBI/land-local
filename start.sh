#!/bin/bash
./clone-repos.sh && ./install-ca.sh && (cd modes/from-source && docker compose up -d)
