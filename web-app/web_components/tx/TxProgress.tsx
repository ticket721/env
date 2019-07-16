import { Tx }                           from 'ethvtx/lib/state/txs';
import * as React                       from 'react';
import { AppState }                     from '@utils/redux/app_state';
import { routes }                       from '@utils/routing';
import { connect }                      from 'react-redux';
import { Button, Progress, Typography } from 'antd';
import { theme }                        from '../../utils/theme';

export interface TxProgressProps {
    tx: Tx;
    t: any;
    scope: string;
    route?: string;
    params?: any;
    end_call?: () => void;
    confirmation_in_progress_call?: (tx_hash: string) => void;
    confirmed_call?: (tx_hash: string) => void;
    error_call?: (tx_hash?: string) => void;
}

interface TxProgressRState {
    current_block: number;
    threshold: number;
}

type MergedTxProgressProps = TxProgressProps & TxProgressRState;

interface TxProgressState {
    confirmation_in_progress_call: boolean;
    confirmed_call: boolean;
    error_call: boolean;
}

class TxProgress extends React.Component<MergedTxProgressProps, TxProgressState> {

    state: TxProgressState = {
        confirmation_in_progress_call: false,
        confirmed_call: false,
        error_call: false
    };

    componentWillUpdate(nextProps: Readonly<TxProgressProps & TxProgressRState>, nextState: Readonly<TxProgressState>, nextContext: any): void {
        if (nextProps.tx) {

            if (nextProps.tx.status === 'Confirming' && nextState.confirmation_in_progress_call === false && nextProps.confirmation_in_progress_call) {
                nextProps.confirmation_in_progress_call(nextProps.tx.hash);
                this.setState({
                    confirmation_in_progress_call: true
                });
            }

            if (nextProps.tx.status === 'Confirmed' && nextState.confirmed_call === false && nextProps.confirmed_call) {
                nextProps.confirmed_call(nextProps.tx.hash);
                this.setState({
                    confirmed_call: true
                });
            }

            if (nextProps.tx.status === 'Error' && nextState.error_call === false && nextProps.error_call) {
                nextProps.error_call(nextProps.tx.hash);
                this.setState({
                    error_call: true
                });
            }

        }
    }

    status_builder = (): any => {

        if (this.props.tx) {
            switch (this.props.tx.status) {

                case 'Unknown':
                    return {
                        progress: 10,
                        message: `${this.props.scope}_tx_progress_wait_for_confirmations`
                    };
                case 'Confirming':
                    let progress = 0;
                    if (this.props.tx.infos.blockNumber !== null && this.props.current_block !== null) {
                        progress = ((this.props.current_block - this.props.tx.infos.blockNumber) / this.props.threshold) * 90;
                        if (progress > 90) {
                            progress = 90;
                        }
                        if (progress < 0) {
                            progress = 0;
                        }
                    }
                    return {
                        progress: 10 + progress,
                        message: `${this.props.scope}_tx_progress_wait_for_confirmations`
                    };
                case 'Confirmed':
                    return {
                        progress: 100,
                        message: `${this.props.scope}_tx_progress_confirmed`
                    };
                case 'Error':
                    return {
                        progress: 100,
                        message: `${this.props.scope}_tx_progress_error`,
                        error: true
                    };

            }
        } else {
            return {
                progress: 10,
                message: `${this.props.scope}_tx_progress_wait_for_broadcast`
            };
        }
    }

    render(): React.ReactNode {

        const status = this.status_builder();

        return <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{textAlign: 'center'}} id='tx_progress'>
                <Typography.Text style={{fontSize: 22}}>{this.props.t(status.message)}</Typography.Text>
                <br/>
                <br/>
                <style>{`
                    #tx_progress .ant-progress-success-bg, .ant-progress-bg {
                        background-color: ${theme.primary};
                    }
                `}</style>
                <Progress strokeColor={theme.primary} type='circle' percent={status.progress} status={status.error ? 'exception' : 'active'} strokeLinecap='square'/>
                <br/>
                <br/>
                {
                    status.progress === 100
                        ?
                        (this.props.end_call

                            ?
                            <Button onClick={this.props.end_call}>
                                {this.props.t(`${this.props.scope}_final_button`)}
                            </Button>

                            :
                            <routes.Link route={this.props.route} params={this.props.params}>
                                <Button>
                                    {this.props.t(`${this.props.scope}_final_button`)}
                                </Button>
                            </routes.Link>)
                        :
                        <Button
                            disabled={true}
                            loading={true}
                        >
                            {this.props.t(`${this.props.scope}_waiting_button`)}
                        </Button>
                }
            </div>
        </div>;
    }
}

const mapStateToProps = (state: AppState): TxProgressRState => ({
    current_block: state.blocks.current_height,
    threshold: state.vtxconfig.confirmation_threshold
});

export default connect(mapStateToProps)(TxProgress) as React.ComponentType<TxProgressProps>;
