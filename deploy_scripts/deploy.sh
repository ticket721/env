#! /bin/bash


if [[ "$TRAVIS_BRANCH" = "ropsten" ]]; then

    HASH=$(git rev-parse HEAD | cut -c1-7)
    WEBAPP_VERSION=$(node ./deploy_scripts/version_extractor.js web-app)
    SERVER_VERSION=$(node ./deploy_scripts/version_extractor.js server)

    ./deploy_scripts/tag_exist_check.sh ticket721/server "${SERVER_VERSION}-ropsten.${HASH}"

    if [[ "$?" = "1" ]]; then
        echo "Cannot find image for server"
        exit 1
    fi

    ./deploy_scripts/tag_exist_check.sh ticket721/server-modules "${SERVER_VERSION}-ropsten.${HASH}"

    if [[ "$?" = "1" ]]; then
        echo "Cannot find image for server-modules"
        exit 1
    fi

    ./deploy_scripts/tag_exist_check.sh ticket721/webapp "${WEBAPP_VERSION}-ropsten.${HASH}"

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
        --set webapp.config.tx_explorer="${ROPSTEN_TX_EXPLORER}" \
        --set webapp.config.google_analytics_token=${GOOGLE_ANALYTICS_TOKEN} \
        --set letsencrypt.server=${LETSENCRYPT_ACME_SERVER} \
        --set nginx.controller.service.loadBalancerIP=${GOOGLE_CLOUD_IP}


fi


