# FROM nethermind/nethermind:alpine as dependencies
ARG NETHERMIND_VERSION
ARG NETHERMIND_LOG

# WORKDIR /nethermind

# RUN apk add --no-cache python3 make g++

# RUN npm install

FROM nethermind/nethermind:${NETHERMIND_VERSION}



WORKDIR /nethermind/genesis/

# TODO: FIX CHAINSPEC FILE PATH.. Did not find chainspec in embedded resources: genesis/spaceneth.json
COPY genesis/spaceneth.json /nethermind/genesis/spaceneth.json
COPY configs/config.cfg /nethermind/configs/config.cfg
COPY staticNodes/static-nodes.json /nethermind/genesis/static-nodes.json

# COPY . /nethermind/
# COPY --from=dependencies /nethermind /nethermind

WORKDIR /nethermind


# ENTRYPOINT [ \
#   "./Nethermind.Runner", \
#   "--config= " ${NETHERMIND_CONFIG}, \
#   "--log " ${NETHERMIND_LOG} \
# ]


ENTRYPOINT ["/bin/sh", "-c", "apt update && apt install -y curl && ./Nethermind.Runner --config spaceneth --log WARN --datadir data " ]
