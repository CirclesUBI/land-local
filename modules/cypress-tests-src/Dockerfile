FROM fedora:37

RUN dnf install -y \
        chromium \
        git \
        nodejs npm \
        xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib

WORKDIR /o-platform-cypress
COPY run.sh /run.sh

ENTRYPOINT ["sh", "/run.sh"]
