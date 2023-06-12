#!/bin/bash

trap "echo; exit" INT
trap "echo; exit" TERM

clone-repositories () {
    echo Clone repositories
    ./clone-repos.sh
    }

install-certificate-authority () {
    echo Install certificate authority
    ./install-ca.sh
    }

build-container-images () {
    echo Build container images from source
    cd modes/from-source
    set -x
    docker compose build
    }

pull-container-images () {
    echo Pull remaining container images
    cd modes/from-source
    set -x
    docker compose pull
    }

start-compose-project () {
    echo Start the project
    cd modes/from-source
    set -x
    docker compose up -d
    }

echo "Check and prepare prerequisites"
clone-repositories
install-certificate-authority

echo "Prepare and enter application runtime mode"
build-container-images
pull-container-images
start-compose-project
