import { Reducer }                                                                        from 'redux';
import { InitialAppState, LWTransactionsSection, TxAttempt }                              from '../app_state';
import { ILWTXAddSignAttempt, ILWTXAddTxAttempt, ILWTXSetStatus, LWTXActions, LWTXTypes } from './actions';

const LWTXAddSignAttemptReducer: Reducer<LWTransactionsSection, ILWTXAddSignAttempt> =
    (state: LWTransactionsSection, action: ILWTXAddSignAttempt): LWTransactionsSection => ({
        ...state,
        attempts: [
            ...state.attempts,
            {
                type: 'Sign',
                sign: action.sign,
                error: null,
                id: action.id,
                validate: null
            }
        ]
    });

const LWTXAddTxAttemptReducer: Reducer<LWTransactionsSection, ILWTXAddTxAttempt> =
    (state: LWTransactionsSection, action: ILWTXAddTxAttempt): LWTransactionsSection => ({
        ...state,
        attempts: [
            ...state.attempts,
            {
                type: 'Tx',
                tx: action.tx,
                error: action.error,
                id: action.id,
                validate: null
            }
        ]
    });

const LWTXSetStatusReducer: Reducer<LWTransactionsSection, ILWTXSetStatus> =
    (state: LWTransactionsSection, action: ILWTXSetStatus): LWTransactionsSection => ({
        ...state,
        attempts: [
            ...state.attempts.map((tx: TxAttempt) => {
                if (tx.id === action.id) {
                    tx.validate = action.status;
                }
                return tx;
            })
        ]

    });

export const LWTXReducer: Reducer<LWTransactionsSection, LWTXTypes> =
    (state: LWTransactionsSection = InitialAppState.lwtx, action: LWTXTypes): LWTransactionsSection => {

        switch (action.type) {
            case LWTXActions.AddTxAttempt:
                return LWTXAddTxAttemptReducer(state, action as ILWTXAddTxAttempt);
            case LWTXActions.AddSignAttempt:
                return LWTXAddSignAttemptReducer(state, action as ILWTXAddSignAttempt);
            case LWTXActions.SetStatus:
                return LWTXSetStatusReducer(state, action as ILWTXSetStatus);
            default:
                return state;
        }

    };
