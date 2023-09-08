FROM node:18-alpine as dependencies



COPY ./init.sh /app/init.sh
RUN chmod +x /app/init.sh

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

WORKDIR /app
RUN apk add --no-cache python3 make g++ 

RUN npm install

FROM node:18-alpine as runtime
COPY --from=dependencies /app /app

COPY truffle /app/truffle
COPY seed-data /app/seed-data

WORKDIR /app

RUN apk add gcompat

ENTRYPOINT ["/bin/sh", "/app/init.sh"]
