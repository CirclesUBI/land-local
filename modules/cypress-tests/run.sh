#!/bin/sh
cd /o-platform-cypress
# curl -I -o /o-platform-cypress/cypress/fixtures/Person_1.y4m https://static.cirlcesubi.localhost/Person_1.y4m
ls -l /o-platform-cypress/cypress/fixtures
# Check if the above directory is empty
if [ "$(ls -A /o-platform-cypress/cypress/fixtures)" ]; then
   echo "Not empty"
else
   echo "Empty"
fi
npx cypress run
