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
| `server_setup` | Setup requirement processes for the server |
| `server_start` | Run the server |

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
