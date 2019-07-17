import Tx            from 'ethereumjs-tx';
import { Action }    from 'redux';
import { TypedData } from '../app_state';

export const LWTXActions = {
    AddTxAttempt: '[LWTX] ADD_TX_ATTEMPT',
    AddSignAttempt: '[LWTX] ADD_SIGN_ATTEMPT',
    SetStatus: '[LWTX] SET_STATUS'
};

export const LWTXAttemptType = {
    Tx: 'Tx',
    Sign: 'Sign'
};

export interface ILWTXAttempt {
    type: string;
}

export interface ILWTXAddTxAttempt extends Action<string>, ILWTXAttempt {
    tx: Tx;
    error: string;
    id: number;
}

export interface ILWTXAddSignAttempt extends Action<string>, ILWTXAttempt {
    sign: TypedData[];
    id: number;
}

/**
 * A New Transaction attempt is created.
 *
 * @param tx
 * @param error
 * @param id
 * @constructor
 */
export const LWTXAddTxAttempt = (tx: Tx, error: string, id: number): ILWTXAddTxAttempt => ({
    type: LWTXActions.AddTxAttempt,
    tx,
    error,
    id
});

export const LWTXAddSignAttempt = (sign: TypedData[], id: number): ILWTXAddSignAttempt => ({
    type: LWTXActions.AddSignAttempt,
    sign,
    id
});

export interface ILWTXSetStatus extends Action<string> {
    id: number;
    status: boolean;
}

/**
 * Resolves a previously created transaction attempt
 *
 * @param id
 * @param status
 * @constructor
 */
export const LWTXSetStatus = (id: number, status: boolean): ILWTXSetStatus => ({
    type: LWTXActions.SetStatus,
    id,
    status
});

export type LWTXTypes = ILWTXAddTxAttempt | ILWTXAddSignAttempt | ILWTXSetStatus;
