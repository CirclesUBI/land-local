FROM node:18-alpine as dependencies

COPY ./init.sh /app/init.sh
RUN chmod +x /app/init.sh

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

WORKDIR /app
RUN apk add --no-cache python3 make g++ git
RUN npm install -g npm@10.0.0 --loglevel verbose
RUN npm install --loglevel verbose

FROM node:18-alpine as runtime
COPY --from=dependencies /app /app

COPY truffle /app/truffle
COPY seed-data /app/seed-data

# RUN curl -o /usr/bin/solc -fL https://github.com/ethereum/solidity/releases/download/v0.7.0/solc-static-linux && chmod u+x /usr/bin/solc


WORKDIR /app

RUN apk add gcompat

ENTRYPOINT ["/bin/sh", "/app/init.sh"]
