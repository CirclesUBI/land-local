FROM ubuntu:latest

WORKDIR /app
COPY seed.sh seed.sh
COPY initial_user.sql initial_user.sql
COPY initial_business_categories.sql initial_business_categories.sql
COPY initial_businesses.sql initial_businesses.sql

RUN apt update
RUN apt install -y gettext-base git postgresql-client jq

ENTRYPOINT ["/bin/sh", "seed.sh"]
