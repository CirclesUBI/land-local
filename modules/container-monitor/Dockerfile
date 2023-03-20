FROM node:latest


WORKDIR /app
COPY main.js ./main.js
RUN npm i express dockerode

EXPOSE 3000

CMD ["node", "main.js"]
