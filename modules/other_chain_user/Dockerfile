FROM node:lts

COPY . /app/
WORKDIR /app

RUN npm install

ENTRYPOINT ["/usr/local/bin/node", "/app/main.js"]
