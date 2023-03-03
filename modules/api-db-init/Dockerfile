FROM node:latest

WORKDIR /app

RUN apt update
RUN apt install -y gettext-base git postgresql-client jq qrencode

RUN npm install bip39

COPY generate_key_phrase.js generate_key_phrase.js
COPY seed.sh seed.sh
COPY initial_user.sql initial_user.sql
COPY insert_persons.sql insert_persons.sql
COPY insert_organizations.sql insert_organizations.sql
COPY initial_business_categories.sql initial_business_categories.sql

ENTRYPOINT ["/bin/sh", "seed.sh"]
