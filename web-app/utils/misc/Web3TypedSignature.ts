import SigUtil       from 'eth-sig-util';
import { TypedData } from '../redux/app_state';

export const sign = async (web3: any, from: string, payload: TypedData[]): Promise<any> => {

    payload.push({
        type: 'uint256',
        name: 'timestamp',
        value: Date.now()
    });

    return new Promise<string>((ok: any, ko: any): void => {

        const func = web3.currentProvider.sendAsync || web3.currentProvider.send;

        func({
            method: 'eth_signTypedData',
            params: [payload, from],
            from: from,
        }, (error: Error, result: any): void => {
            if (error) {
                ko(error);
            } else {
                ok({
                    result: result.result,
                    payload
                });
            }
        });
    });
};

export const typed_signature = async (privateKey: string, payload: any[]): Promise<string> =>
    SigUtil.signTypedData(privateKey, {data: payload});
