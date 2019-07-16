# web-app
Web App to use the ticket721 plateform

## Status

| Name | Shield |
| :---: | :----: |
| Travis | [![Build Status](https://travis-ci.org/ticket721/web-app.svg?branch=develop)](https://travis-ci.org/ticket721/web-app) |
| Coveralls | [![Coverage Status](https://coveralls.io/repos/github/ticket721/web-app/badge.svg?branch=develop)](https://coveralls.io/github/ticket721/web-app?branch=develop) |

## Env

| Variable | Definition |
| :------: | :--------: |
| `google_api_token` | Api key used for google maps |
| `google_analytics_token` | ID used for google analytics |
| `strapi_endpoint` | URL of the strapi server |
| `tx_explorer` | URL for the transaction explorer, with `TRANSACTION_HASH` where it should be replaced (`https://ropsten.etherscan.io/tx/TRANSACTION_HASH`)|

## Tasks

## Module Update Procedure: Minter

When adding or editing a Minter module, the following files should be checked:

* `minters.json`, the I18N configuration
* `MinterSelectionForm/ignore.ts`, Ignored Modules
* `BuildArgumentForm/overrides.ts`, Build Argument Processors
* `MinterCategoriesGetter.ts`, used to retrieve ticket categories
* `MintingController.ts`, used to properly call the mint method
* `EventCreationSummary/MinterDescription.ts`, Used to pretty print a concise decription of the minting process

## Module Update Procedure: Marketer

When adding or editing a Minter module, the following files should be checked:

* `marketers.json`, the I18N configuration
* `MarketerSelectionForm/ignore.ts`, Ignored Modules
* `BuildArgumentForm/overrides.ts`, Build Argument Processors
* `EventCreationSummary/MarketerDescription.ts`, Used to pretty print a concise decription of the minting process
* `web_components/event/misc/MarketerEnabled.ts`, Used to quickly disable Marketplace features
* `web_components/ticket/modals/MarketerSaleController.ts` Create input form to sell a ticket

## ENV Variables for the build process

| Var Name | Details |
| :---:    | :---:   |
| `NEXUS_USERNAME` | Username to use to recover the portal |
| `NEXUS_PASSWORD` | Password for given username |
| `NEXUS_ENDPOINT` | Url of the nexus repo (no trailing `/`) |
| `NEXUS_REPOSITORY` | Name of the repository |
| `DOCKER_WEBAPP_REPOSITORY` | Repository to push built images |
| `DOCKER_USERNAME` | Username for docker account |
| `DOCKER_PASSWORD` | Password of docker account |

All these variables are used in `build.sh` and `publish.js`
