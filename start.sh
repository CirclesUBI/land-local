#!/bin/bash
./install-ca.sh && (cd modes/from-source && docker compose up -d)
