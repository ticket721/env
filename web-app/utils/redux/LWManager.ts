import { Store }                                             from 'redux';
import { AppState, LocalWalletStatus, TxAttempt, TypedData } from './app_state';
import { UnlockingLocalWallet }                 from './app/actions';
import { fromV3 }                               from 'ethereumjs-wallet';
import Tx                                       from 'ethereumjs-tx';
import Web3                                     from 'web3';
import { LWTXAddSignAttempt, LWTXAddTxAttempt } from './lwtransactions/actions';
import { getAccount }                           from 'ethvtx/lib/accounts/helpers/getters';
import { typed_signature }                      from '../misc/Web3TypedSignature';
import { RGA }                                  from '../misc/ga';

/**
 * This class manages the web3 instance used in the T721Provider Scenario
 *
 * It will build the instance and will inject the hook in the provider.
 *
 * Upon any tx attempt from the given web3 instance, a pop-up to unlock and accept the transaction will be displayed
 */
export class LWManager {

    private static store: Store;
    private static coinbase: string;
    private static id: number = 0;

    constructor() {

    }

    static init(store: Store): void {
        LWManager.store = store;
    }

    public static unlock_if_needed = async (): Promise<void> =>
        new Promise<void>((ok: any, ko: any): void => {
            const state: AppState = LWManager.store.getState();

            if (state.app.t721_wallet.status === LocalWalletStatus.Locked) {
                LWManager.store.dispatch(UnlockingLocalWallet());
            } else {
                return ok();
            }

            let end_sub_cb;
            end_sub_cb = LWManager.store.subscribe((): void => {
                const new_state: AppState = LWManager.store.getState();

                switch (new_state.app.t721_wallet.status) {
                    case LocalWalletStatus.Locked: {
                        end_sub_cb();
                        RGA.event({
                            category: 'T721 Wallet',
                            action: 'Unlock Fail',
                            value: 5
                        });
                        ko();
                        break;
                    }
                    case LocalWalletStatus.Unlocked: {
                        end_sub_cb();
                        RGA.event({
                            category: 'T721 Wallet',
                            action: 'Unlock Success'
                        });
                        ok();
                        break;
                    }
                }

            });

        })

    public static signAttempt = async (msgParams: TypedData[], id: number): Promise<void> => {

        LWManager.store.dispatch(LWTXAddSignAttempt(msgParams, id));

        return new Promise<void>((ok: any, ko: any): void => {
            let end_sub_cb;
            end_sub_cb = LWManager.store.subscribe((): void => {
                const state = LWManager.store.getState();

                const attempt_list = state.lwtx.attempts.filter((tx: TxAttempt): boolean => tx.id === id);

                if (attempt_list.length === 0) {
                    end_sub_cb();
                    ko();
                }

                const attempt = attempt_list[0];

                if (attempt.validate !== null) {
                    if (attempt.validate === false) {
                        end_sub_cb();
                        ko();
                    } else {
                        end_sub_cb();
                        ok();
                    }
                }

            });
        });
    }

    public static sendTxAttempt = async (tx: Tx, error: string, id: number): Promise<void> => {

        LWManager.store.dispatch(LWTXAddTxAttempt(tx, error !== '' ? error : null, id));

        return new Promise<void>((ok: any, ko: any): void => {
            let end_sub_cb;
            end_sub_cb = LWManager.store.subscribe((): void => {
                const state = LWManager.store.getState();

                const attempt_list = state.lwtx.attempts.filter((tx: TxAttempt): boolean => tx.id === id);

                if (attempt_list.length === 0) {
                    end_sub_cb();
                    ko();
                }

                const attempt = attempt_list[0];

                if (attempt.validate !== null) {
                    if (attempt.validate === false) {
                        end_sub_cb();
                        ko();
                    } else {
                        end_sub_cb();
                        ok();
                    }
                }

            });
        });
    }

    public static unlock = (locked_wallet: any, pwd: string): string =>
        fromV3(locked_wallet, pwd)

    public static buildWeb3 = async (provider: any): Promise<Web3> => {
        const web3 = new Web3(provider);

        LWManager.coinbase = LWManager.store.getState().app.t721_wallet.address;

        const defaultGasPrice = await web3.eth.getGasPrice();

        provider._send = provider.send;

        // Intercept all sendTransaction calls and manually sign them with the lw, then continue as sendRawTransaction
        provider.send = async (...args: any): Promise<any> => {
            const command = args[0];

            switch (command.method) {
                case 'eth_signTypedData': {

                    if (typeof args[1] !== 'function') {
                        throw new Error('Missing callback function');
                    }

                    const cb = args[1];
                    const msgParams = command.params[0];
                    const from = command.params[1];

                    if (from.toLowerCase() !== LWManager.coinbase.toLowerCase()) {
                        throw new Error(`Invalid from: ${from}, only ${LWManager.coinbase} allowed (coinbase)`);
                    }

                    await LWManager.unlock_if_needed();
                    ++LWManager.id;
                    try {
                        await LWManager.signAttempt(msgParams, LWManager.id - 1);
                        RGA.event({
                            category: 'T721 Wallet',
                            action: 'Signature Success'
                        });
                    } catch (e) {
                        RGA.event({
                            category: 'T721 Wallet',
                            action: 'Signature Failed',
                            value: 5
                        });
                        return cb(new Error('Signature Cancelled or Timed Out'), null);
                    }

                    const pk = LWManager.store.getState().app.t721_wallet.private_key;

                    try {
                        const res = await typed_signature(pk._privKey, msgParams);
                        return cb(null, {result: res});
                    } catch (e) {
                        return cb(e, null);
                    }

                }
                case 'eth_sendTransaction':
                    const tx_args = command.params[0];

                    if (!tx_args.from) throw new Error(`From address is required`);
                    if (tx_args.from && tx_args.from.toLowerCase() !== LWManager.coinbase.toLowerCase()) throw new Error(`Invalid from: ${tx_args.from}, only ${LWManager.coinbase} allowed (coinbase)`);

                    const nonce = getAccount(LWManager.store.getState(), '@coinbase').transaction_count;

                    if (nonce === null) throw new Error('No information about coinbase found in vtxconfig');
                    if (!tx_args.gas) {
                        tx_args.gas = Math.floor((await web3.eth.estimateGas({
                            from: tx_args.from,
                            to: tx_args.to,
                            data: tx_args.data,
                            value: tx_args.value
                        })) * 1.2);
                    }
                    if (!tx_args.gasPrice) tx_args.gasPrice = defaultGasPrice;
                    if (!tx_args.nonce) tx_args.nonce = '0x' + nonce.toString(16);
                    if (!tx_args.value) tx_args.value = '0x00';

                    await LWManager.unlock_if_needed();

                    const tx = new Tx(tx_args);

                    tx.sign(LWManager.store.getState().app.t721_wallet.private_key._privKey);

                    const validate = tx.validate(true);
                    ++LWManager.id;
                    await LWManager.sendTxAttempt(tx, validate, LWManager.id - 1);

                    command.method = 'eth_sendRawTransaction' ;
                    command.params = [
                        '0x' + tx.serialize().toString('hex')
                    ];

                    RGA.event({
                        category: 'T721 Wallet',
                        action: 'Transaction Sent'
                    });

                    break ;
            }

            return provider._send(...args);
        };

        const getCoinbase = async (): Promise<string> =>
            LWManager.coinbase;

        const getAccounts = async (): Promise<string[]> =>
            [LWManager.coinbase];

        // Overwrite methods to return LW Address as coinbase and only available wallet
        (web3 as any).eth.getCoinbase = getCoinbase;
        (web3 as any).eth.getAccounts = getAccounts;

        return web3;
    }
}
