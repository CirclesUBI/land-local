FROM node:latest

RUN apt-get update
RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

RUN git clone https://github.com/CirclesUBI/o-platform-cypress.git 
WORKDIR /o-platform-cypress
RUN git checkout feature/app-103-automated-e2e-testing-with-cypress 
RUN npm install

ENTRYPOINT ["npx", "cypress", "run"]
