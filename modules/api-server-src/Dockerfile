FROM node:latest
LABEL org.opencontainers.image.source=https://github.com/CirclesUBI/api-server

RUN npm install -g nodemon
RUN npm install -g typescript

RUN apt update
RUN apt install jq -y

WORKDIR /api-server

COPY run.sh /run.sh
RUN chmod +x /run.sh

ENTRYPOINT ["sh", "/run.sh"]
