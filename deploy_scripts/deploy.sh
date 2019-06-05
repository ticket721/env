#! /bin/bash


if [[ "$TRAVIS_BRANCH" = "ropsten" ]]; then

    git submodule status

    WEBAPP_COMMIT_HASH=$(node ./deploy_scripts/commit_hash_extractor.js "$(git submodule status | grep 'web-app')")
    SERVER_COMMIT_HASH=$(node ./deploy_scripts/commit_hash_extractor.js "$(git submodule status | grep 'server')")
    VERSION=$(node ./deploy_scripts/version_extractor.js)

    ./deploy_scripts/tag_exist_check.sh ticket721/server "${VERSION}-ropsten.${SERVER_COMMIT_HASH}"

    if [[ "$?" = "1" ]]; then
        echo "Cannot find image for server"
        exit 1
    fi

    ./deploy_scripts/tag_exist_check.sh ticket721/server-modules "${VERSION}-ropsten.${SERVER_COMMIT_HASH}"

    if [[ "$?" = "1" ]]; then
        echo "Cannot find image for server-modules"
        exit 1
    fi

    ./deploy_scripts/tag_exist_check.sh ticket721/webapp "${VERSION}-ropsten.${WEBAPP_COMMIT_HASH}"

    if [[ "$?" = "1" ]]; then
        echo "Cannot find image for web-app"
        exit 1
    fi

    cd t721
    ./deploy_scripts/pre_install.sh

    helm upgrade ${HELM_RELEASE_NAME} . \
        --set ropsten.enabled=true \
        --set env.gcp=true \
        --set serverModules.container.version="${VERSION}-ropsten.${SERVER_COMMIT_HASH}" \
        --set server.container.version="${VERSION}-ropsten.${SERVER_COMMIT_HASH}" \
        --set webapp.container.version="${VERSION}-ropsten.${WEBAPP_COMMIT_HASH}" \
        --set webapp.config.strapi_endpoint="${STRAPI_PUBLIC_ENDPOINT}" \
        --set webapp.config.google_api_token="${GOOGLE_API_TOKEN}" \
        --set letsencrypt.server=${LETSENCRYPT_ACME_SERVER}


fi


