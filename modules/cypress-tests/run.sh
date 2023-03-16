#!/bin/sh
cd /o-platform-cypress
mkdir -p /fixtures
curl -o /fixtures/Person_1.y4m https://static.cirlcesubi.localhost/Person_1.y4m
npx cypress run
