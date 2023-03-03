FROM circlesubi/api-server:dev

WORKDIR /api-server

COPY run.sh /run.sh
RUN chmod +x /run.sh

ENTRYPOINT ["sh", "/run.sh"]
