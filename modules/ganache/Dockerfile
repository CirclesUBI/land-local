FROM trufflesuite/ganache:latest
COPY ganache_with_accounts.sh /app

COPY contracts /app/contracts
WORKDIR /app/contracts

RUN npm init -y --silent
RUN npm install @truffle/contract
RUN npm install truffle
RUN npm install web3
RUN npx truffle compile

RUN  apt-get update && apt-get -y install procps psmisc
RUN /app/ganache_with_accounts.sh & (npx truffle depoy && ps && killall node)

EXPOSE 8545

ENTRYPOINT ["/bin/sh", "/app/ganache_with_accounts.sh"]
