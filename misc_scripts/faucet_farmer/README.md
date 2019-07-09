# faucet farmer

This script requires:

- `openvpn` installed on your system
- A set of `openvpn` config files
- `root` rights

This script starts an infinite loop that changes your ip, asks one ether on the ropsten ethereum faucet, transfer it to a target account and starts again.

```
sudo run npm start path_to_openvpn_configs_directory path_to_auth_file target_ethereum_address infura_endpoint ether_limit
```
