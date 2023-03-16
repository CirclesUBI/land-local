#!/bin/sh
cd /o-platform-cypress
mkdir -p /o-platform-cypress/cypress/fixtures
curl -o /o-platform-cypress/cypress/fixtures/Person_1.y4m https://static.cirlcesubi.localhost/Person_1.y4m
npx cypress run
