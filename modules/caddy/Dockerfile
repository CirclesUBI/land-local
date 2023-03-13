FROM caddy:latest
RUN apt-get update
RUN apt-get install libnss3-tools -y
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
