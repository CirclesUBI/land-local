#!/bin/sh
cd /o-platform-cypress
ls -l
ls -l cypress
rm -rf node_modules
npm install
npx cypress run --browser chromium
