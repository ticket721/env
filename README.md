# env
Complete Environment for ticket721

## Env

| Variable | Mandatory | Values | Description |
| :---: | :---: | :---: | :---: |
| `T721_NETWORK` | yes | `test`, `local` | This value will tell every task how it should behave / configure the tools |

## Tasks

| Name | Description |
| :---: | :---------: |
| `init` | Setup the portalize configuration |
| `dismantle` | Runs `clean` and dismantles the portalize configuration |
| `clean` | Calls clean on submodules |
| `deploy` | Configure the network dependeing on `T721_NETWORK`, and deploys all the smart contracts |

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

## Teardown development environment

#### Clean all submodules

```shell
gulp clean
```

#### Dismantle Portalize and clean all submodules

```shell
gulp dismantle
```
