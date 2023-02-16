FROM node:alpine

WORKDIR /blabb/dapp

COPY ganache_with_accounts.sh /blabb/dapp
COPY hardhat.config.js /blabb/dapp

RUN cd /blabb/dapp && npm init -y
RUN cd /blabb/dapp && npm i hardhat

EXPOSE 8545

CMD ["npx", "hardhat", "node"]
