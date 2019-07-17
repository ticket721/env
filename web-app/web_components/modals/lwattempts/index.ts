import { AppState, TxAttempt }                                                     from '@utils/redux/app_state';
import { IReduxDispatchLWAttemptProps, IReduxStateLWAttemptProps, LWAttemptProps } from './LWAttempt';
import { connect }                                                                 from 'react-redux';
import { Dispatch }                                                                from 'redux';
import { LWTXSetStatus }                                                           from '@utils/redux/lwtransactions/actions';
import { I18N }                                                                    from '@utils/misc/i18n';
import dynamic                                                                     from 'next-server/dynamic';
import * as React                                                                        from 'react';

const LWAttempt = dynamic<LWAttemptProps>(async () => import('./LWAttempt'), {
    loading: (): React.ReactElement => null
});

const mapStateToProps = (state: AppState): IReduxStateLWAttemptProps => ({
    attempts: state.lwtx.attempts.filter((tx: TxAttempt) => tx.validate === null),
    coinbase: state.vtxconfig.coinbase
});

const mapDispatchToProps = (dispatch: Dispatch): IReduxDispatchLWAttemptProps => ({
    setStatus: (tx_id: number, status: boolean): any => dispatch(LWTXSetStatus(tx_id, status))
});

export default I18N.withNamespaces(['lwmodals'])(connect(mapStateToProps, mapDispatchToProps)(LWAttempt));
