#!/bin/sh
cd /cypress-tests
npm install -g npm@9.6.1
npm install cypress --save-dev
cypress install
npx cypress run