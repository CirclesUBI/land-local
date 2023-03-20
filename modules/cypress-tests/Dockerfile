FROM fedora:37

RUN dnf install -y \
        chromium \
        git \
        nodejs npm \
        xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib

RUN git clone https://github.com/CirclesUBI/o-platform-cypress.git 
WORKDIR /o-platform-cypress
COPY run.sh /run.sh

RUN git checkout feature/app-103-automated-e2e-testing-with-cypress 
RUN npm install

ENTRYPOINT ["sh", "/run.sh"]
