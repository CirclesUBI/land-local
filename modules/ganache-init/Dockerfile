FROM node:latest

COPY ./init.sh /app/init.sh
RUN chmod +x /app/init.sh

COPY ./contracts /app/contracts
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm install

WORKDIR /app/contracts

ENTRYPOINT ["/bin/sh", "/app/init.sh"]
