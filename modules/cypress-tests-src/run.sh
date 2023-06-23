#!/bin/sh
cd /o-platform-cypress
ls -l
ls -l cypress
ls -l cypress/fixtures
rm -rf node_modules
npm install
# npx cypress run --browser chromium
./run.sh -n signupJourneyImportExisting
