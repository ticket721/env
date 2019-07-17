#! /bin/bash

npm install -g portalize

env PORTALIZE_ARCHIVE_NAME=../ropsten.tar.gz portalize restore ./build_config/portalize.config.json

docker build -f ./build_config/modules_config/Dockerfile -t server-modules .
docker build -f ./build_config/server_config/Dockerfile -t server --build-arg server_mode=$TRAVIS_BRANCH .

rm -rf portal

