FROM trufflesuite/ganache:latest
COPY ganache_with_accounts.sh /app

COPY contracts /app/contracts
WORKDIR /app/contracts

RUN npm init -y --silent
RUN npm install @truffle/contract truffle web3

RUN mkdir /var/backups-db

RUN  apt-get update && apt-get -y install procps psmisc
RUN /app/ganache_with_accounts.sh & (npx truffle deploy && ps && killall node)

RUN cp -r /var/ganache-db /app/ganache-seed-db

EXPOSE 8545

ENTRYPOINT ["/bin/sh", "/app/ganache_with_accounts.sh"]
