#! /bin/bash

env PORTALIZE_ARCHIVE_NAME=../rinkeby.tar.gz portalize restore ./build_config/portalize.config.json

docker build -f ./build_config/Dockerfile -t webapp .

rm -rf portal

