FROM trufflesuite/ganache:latest
COPY ganache_with_accounts.sh /app

EXPOSE 8545

ENTRYPOINT ["/bin/sh", "/app/ganache_with_accounts.sh"]
