# env
Complete Environment for ticket721

## Env

| Variable | Mandatory | Values | Description |
| :---: | :---: | :---: | :---: |
| `T721_NETWORK` | yes | `test`, `local` | This value will tell every task how it should behave / configure the tools |
| `T721_SERVER` | yes | `development` | This value will tell the `server` module how it should behave, and where it should connect itself |

## Tasks

| Name | Description |
| :---: | :---------: |
| `init` | Setup the portalize configuration |
| `dismantle` | Runs `clean` and dismantles the portalize configuration |
| `clean` | Calls clean on submodules |
| `deploy` | Configure the network depending on `T721_NETWORK`, and deploys all the smart contracts |
| `simulation` | Run the simulation script from the `contracts` module, populating the configured ethereum node |

## Setup process

#### Fetch submodules

Use the following command to fetch the submodules
```shell
npm run t721:fetch
```

#### Install dependencies

```shell
npm install
npm run t721:init
```

#### Initialize Portalize

You need gulp installed globally
`npm install -g gulp`

```shell
gulp init
```

## Start development environment

#### Network and Smart Contracts

The following command starts the local ganache network in docker (docker needs to be installed).
The configuration is written in Portalize.
The contracts are deployed with `zos`.

```shell
gulp deploy
```

#### Mining blocks

If you need to mine empty blocks for any reason during the development, use the following command

```shell
gulp fake_mine --blocks number_of_blocks
```

#### Creating Events, Tickets, Interactions

If you need to create content on your test network, use the following command
The actions that are executed are random transfers, buy, sales, and sale_closes

```shell
gulp simulate --accounts number_of_accounts_to_user --events number_of_events_to_create --tickets number_of_tickets_per_event_to_create --actions number_of_actions_to_executed
```

#### Setting up the server

The following command will run a `postgres` docker instance.

```shell
cd server/
env T721_SERVER=development gulp server:setup
```

#### Starting the server

The following command will start the `strapi` backend.

```shell
env T721_SERVER=development gulp server:start
```

#### Starting the server modules

In another terminal
```shell
cd server
env DATABASE_HOST=127.0.0.1 DATABASE_PORT=5432 DATABASE_NAME=t721 \
    DATABASE_USERNAME=admin DATABASE_PASSWORD=pass ETH_NODE_PROTOCOL=http \
    ETH_NODE_HOST=127.0.0.1 ETH_NODE_PORT=8545 \
    node ./modules_sources/ModuleRunner.js chain_settings_importer
```

and

```shell
cd server
env DATABASE_HOST=127.0.0.1 DATABASE_PORT=5432 DATABASE_NAME=t721 \
    DATABASE_USERNAME=admin DATABASE_PASSWORD=pass ETH_NODE_PROTOCOL=http \
    ETH_NODE_HOST=127.0.0.1 ETH_NODE_PORT=8545 \
    node ./modules_sources/ModuleRunner.js antenna
```

Now your server is fully functional, you can access the admin on localhost:1337/admin.
The first thing you want to do is give permissions to roles. Go into `roles & permissions`

For the `public` role:

| Section | What to activate |
| :---:   | :---:            |
| Permissions - Approver | `count`, `find`, `findone` |
| Permissions - Sale | `count`, `find`, `findone` |
| Permissions - Queuedevent | `count`, `find`, `findone`, `create` |
| Permissions - Height | `count`, `find`, `findone` |
| Permissions - Marketer | `count`, `find`, `findone` |
| Permissions - Eventcontract | `count`, `find`, `findone` |
| Permissions - Ticket | `count`, `find`, `findone` |
| Permissions - Network | `count`, `find`, `findone` |
| Permissions - Minter | `count`, `find`, `findone` |
| Permissions - Address | `count`, `find`, `findone`, `eventsoftickets`, `update` |
| Permissions - Action | `count`, `find`, `findone` |
| Permissions - Event | `count`, `find`, `findone` |
| Upload - Upload | `upload` |

For the `authenticated` role:

| Section | What to activate |
| :---:   | :---:            |
| Permissions - Approver | `count`, `find`, `findone` |
| Permissions - Sale | `count`, `find`, `findone` |
| Permissions - Queuedevent | `count`, `find`, `findone`, `create` |
| Permissions - Height | `count`, `find`, `findone` |
| Permissions - Marketer | `count`, `find`, `findone` |
| Permissions - Eventcontract | `count`, `find`, `findone` |
| Permissions - Ticket | `count`, `find`, `findone` |
| Permissions - Network | `count`, `find`, `findone` |
| Permissions - Minter | `count`, `find`, `findone` |
| Permissions - Address | `count`, `find`, `findone`, `eventsoftickets`, `update` |
| Permissions - Action | `count`, `find`, `findone` |
| Permissions - Event | `count`, `find`, `findone` |
| Upload - Upload | `upload` |
| User Permissions - User | `setwallet` |

#### Running the web app

First you need to setup the directory
```shell
cd web-app
gulp webapp:setup
```


Create a .env file in the webapp directory
```shell
strapi_endpoint=http://localhost:1337
google_api_token=THE_GOOGLE_API_TOKEN_FOR_THE_GOOGLE_MAPS_ETC
```

If you don't have the google api token, no issues, it will only disable the maps but the app will still work.

Then you can start the development build
```shell
cd web-app
env NODE_ENV=development npm start
```


## Teardown development environment

#### Clean all submodules

```shell
gulp clean
```

#### Dismantle Portalize and clean all submodules

```shell
gulp dismantle
```

#### Deploying to ropsten testnet

Start by writing a configuration file:

```json
{
    "network": {
        "name": "ropsten",
        "id": 3
    },
    "infura": {
        "project_id": "INFURA_PROJECT_ID",
        "project_secret": "INFURA_PROJECT_SECRET",
        "node_endpoint": "https://ropsten.infura.io/v3"
    },
    "nexus": {
        "user": "NEXUS_USER",
        "password": "NEXUS_PASS",
        "endpoint": "https://nexus.ticket721.com",
        "repository": "ropsten.raw"
    },
    "server": {
        "url": "https://api.ropsten.ticket721.com"
    },
    "addresses": {
        "deployer": "0x43003a92397e361072f238f63a29ec18f8e12841",
        "admin": "0x31973c960E8BB7D939660244fD6dEf59162BbBd0"
    }
}
```

/!\ Deployer and admin should be derived from the same mnemonic as index 0 (deployer) and 1 (admin).

Then run

```shell
env T721_CONFIG_PATH=./deployment.ropsten.json  gulp deploy_ropsten
```

## Cluster Requirement


* Name => `ropsten`
* Size => `[0 - 1] standard-2, [1 - 6] small`
* IPS => `3 IPS in same region`
* Disks => `geth-disk;ssd;200, pg-disk;hdd;50, strapi-disk;hdd;25`
