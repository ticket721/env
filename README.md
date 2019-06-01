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
gulp server_setup
```

#### Starting the server

The following command will start the `strapi` backend.

```shell
gulp server_start
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
