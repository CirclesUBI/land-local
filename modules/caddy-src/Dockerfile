FROM caddy:latest
RUN apk update
RUN apk add nss nss-tools
# CMD [ "caddy", "adapt", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile", "--pretty" ]
CMD ["caddy", "run", "--config", "/etc/caddy/caddy_config.json"]
