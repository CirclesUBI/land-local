FROM ubuntu:latest

COPY seed.sh seed.sh
COPY initial_user.sql initial_user.sql
COPY initial_business_categories.sql initial_business_categories.sql

RUN apt update
RUN apt install -y gettext-base git postgresql-client

ENTRYPOINT ["/bin/sh", "seed.sh"]
