FROM ubuntu:latest

COPY modules/indexer-db-init/seed.sh seed.sh

RUN apt update
RUN apt install -y gettext-base git postgresql-client

ENTRYPOINT ["/bin/sh", "seed.sh"]
