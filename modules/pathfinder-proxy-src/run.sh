#!/bin/sh
cd /pathfinder-proxy && npm i && (tsc --watch & (sleep 30 && cd dist && nodemon main.js))
