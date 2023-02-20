#FROM trufflesuite/ganache:latest
#COPY ganache_with_accounts.sh /app
#
#EXPOSE 8545
#
#ENTRYPOINT ["/bin/sh", "/app/ganache_with_accounts.sh"]




FROM node:alpine

WORKDIR /var/hardhat_node

COPY hardhat.config.js /var/hardhat_node

RUN cd /var/hardhat_node && npm init -y
RUN cd /var/hardhat_node && npm i hardhat

EXPOSE 8545

CMD ["npx", "hardhat", "node"]
