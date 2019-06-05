#!/usr/bin/env bash

TOKEN=$(curl -s -H "Content-Type: application/json" -X POST -d '{"username": "'${DOCKER_USERNAME}'", "password": "'${DOCKER_PASSWORD}'"}' https://hub.docker.com/v2/users/login/ | jq -r .token)
TAG=$(curl -sH "Authorization: JWT $TOKEN" "https://hub.docker.com/v2/repositories/$1/tags/$2/" | jq -r .name)

echo $TAG

if [[ "$TAG" = "null" ]]; then
    exit 1
fi

