#!/bin/sh
cd /pathfinder-proxy && (tsc --watch & (sleep 30 && cd dist && nodemon main.js))
