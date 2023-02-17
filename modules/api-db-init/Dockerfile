FROM ubuntu:latest

WORKDIR /app

RUN apt update
RUN apt install -y gettext-base git postgresql-client jq

COPY seed.sh seed.sh
COPY initial_user.sql initial_user.sql
COPY insert_persons.sql insert_persons.sql
COPY initial_business_categories.sql initial_business_categories.sql
#COPY initial_businesses.sql initial_businesses.sql

ENTRYPOINT ["/bin/sh", "seed.sh"]
