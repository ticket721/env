import {Teleporter} from './teleporter';
const bip39 = require('bip39');
const hdkey = require('hdkey');
const utils = require('ethereumjs-util');
const request = require('request');
import {Signale}             from 'signale';
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require('web3');

const signale_config = {
    scope: 'teleptr',
    types: {
        info: {
            badge: '',
            color: 'blue',
            label: 'INFO'
        },
        fatal: {
            badge: '',
            color: 'red',
            label: '[KO]'
        },
        warn: {
            badge: '',
            color: 'yellow',
            label: '[!!]'
        }
    }
};

const signale = new Signale(signale_config);

const vpn_dir = process.argv[2];
const auth_file = process.argv[3];
const target = process.argv[4];
const infura_endpoint = process.argv[5];
const limit = parseInt(process.argv[6]);

const tp = new Teleporter();
const main = async () => {
    tp.addPortalDir(vpn_dir);
    tp.setAuth(auth_file);

    while (true) {

        const check_web3 = new Web3(new Web3.providers.HttpProvider(infura_endpoint));

        try {
            const current_balance = parseInt(check_web3.utils.fromWei(await check_web3.eth.getBalance(target), 'ether'));
            if (current_balance >= limit) {
                signale.info(`Limit reached (${current_balance}), waiting ...`);
                await new Promise((ok, ko) => setTimeout(ok, 60000));
                continue;
            }
            signale.info(`[ ${current_balance} / ${limit} ]`)
        } catch (e) {
            continue ;
        }

        tp.teleport();
        while (tp.teleporting) {
            await new Promise((ok, ko) => setTimeout(ok, 1000));
        }
        await new Promise((ok, ko) => setTimeout(ok, 30000));

        const mnemonic = bip39.generateMnemonic();

        const seed = bip39.mnemonicToSeedSync(mnemonic);

        const root = hdkey.fromMasterSeed(seed);
        const derived = root.derive("m/44'/60'/0'/0/0");

        const address = '0x' + utils.privateToAddress(derived.privateKey).toString('hex');
        signale.info(`Generated ${address} (${mnemonic})`);
        let ready = true;

        try {
            await new Promise((ok, ko) => {

                request(`https://faucet.ropsten.be/donate/${address}`, {json: true}, (err, res, body) => {
                    if (err || body.message === 'you are greylisted') return ko();
                    ok();
                });

            });
            signale.info(`${address} Funded`);
        } catch (e) {
            console.log(e);
            ready = false;
            console.log('Error occured');
        }


        tp.teleport();
        while (tp.teleporting) {
            await new Promise((ok, ko) => setTimeout(ok, 1000));
        }
        await new Promise((ok, ko) => setTimeout(ok, 30000));

        if (ready) {
            try {
                const web3 = new Web3(new HDWalletProvider(mnemonic, infura_endpoint));
                while ((await web3.eth.getBalance(address)) === '0') {
                    signale.info('Waiting for balance update ...');
                    await new Promise((ok, ko) => setTimeout(ok, 5000));
                }
                await new Promise((ok, ko) => {
                    web3.eth.sendTransaction({
                        from: address,
                        to: target,
                        value: web3.utils.toWei('0.9999', 'ether')
                    }).on('transactionHash', (hash) => {
                        signale.info(`Sent to target: ${hash}`);
                        ok();
                    })

                });
            } catch (e) {
                signale.info('Error occured while sending');
                continue ;
            }
        }
    }

}

main();
