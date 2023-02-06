FROM node:latest
LABEL org.opencontainers.image.source=https://github.com/CirclesUBI/api-server

RUN npm install -g nodemon
RUN npm install -g typescript

WORKDIR /api-server

CMD ./build.sh / && (tsc --watch & (cd dist && nodemon main.js))
