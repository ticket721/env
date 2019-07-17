import { SignAttempt, TxAttempt, WalletAttempt } from '@utils/redux/app_state';
import * as React                                from 'react';
import { Modal, Pagination, Row, Col, Button }   from 'antd';
import * as GeoPattern                           from 'geopattern';
import { I18NProps }                             from '../../../utils/misc/i18n';
import ILWTxAttempt                              from './LWTxAttempt';
import ILWSignAttempt                            from './LWSignAttempt';
import { theme }                                 from '../../../utils/theme';

export interface LWAttemptProps {
}

export interface IReduxStateLWAttemptProps {
    attempts: WalletAttempt[];
    coinbase: string;
}

export interface IReduxDispatchLWAttemptProps {
    setStatus: (tx_id: number, status: boolean) => any;
}

type MergedLWAttemptProps =
    LWAttemptProps
    & IReduxDispatchLWAttemptProps
    & IReduxStateLWAttemptProps
    & I18NProps;

export interface LWAttemptState {
    tx_idx: number;
}

/**
 * Renders the modal for a transaction attempt. Summarizes the transaction and waits for user input.
 */
export default class LWAttempt extends React.Component<MergedLWAttemptProps, LWAttemptState> {

    state: LWAttemptState = {
        tx_idx: 0
    };

    private readonly handleCancel = (): void => {
        this.props.setStatus(this.props.attempts[this.state.tx_idx].id, false);
    }

    private readonly handleOk = (): void => {
        this.props.setStatus(this.props.attempts[this.state.tx_idx].id, true);
    }

    private readonly handleChange = (new_page: number): void => {
        this.setState({
            tx_idx: new_page - 1
        });
    }

    render(): React.ReactNode {
        const visible: boolean = this.props.attempts.length > 0;

        if (!visible) return null;

        const max = this.props.attempts.length;

        const pattern = GeoPattern.generate(this.props.coinbase).toDataUrl();

        let content = null;
        const error = this.props.attempts[this.state.tx_idx].error !== null;

        switch (this.props.attempts[this.state.tx_idx].type) {
            case 'Tx':
                content =
                    <ILWTxAttempt attempt={this.props.attempts[this.state.tx_idx] as TxAttempt} t={this.props.t}/>;
                break;
            case 'Sign':
                content = <ILWSignAttempt
                    attempt={this.props.attempts[this.state.tx_idx] as SignAttempt}
                    timeout={this.handleCancel}
                    t={this.props.t}
                />;

        }

        return (
            <div>
                <style>{`
                        .lw_attempt .ant-modal-header {
                            background-image: ${pattern};
                        }
                        .lw_attempt .ant-modal-title {
                            color: ${theme.white};
                        }
                        .lw_attempt .ant-modal-close {
                            color: ${theme.white};
                        }
                    `}</style>
                <Modal
                    wrapClassName='lw_attempt'
                    visible={visible}
                    title={`${this.props.t(`lwattempts_${this.props.attempts[this.state.tx_idx].type}`)} #${this.state.tx_idx + 1}`}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            key='back'
                            onClick={this.handleCancel}
                        >
                            {this.props.t(`lwattempts_cancel_button_${this.props.attempts[this.state.tx_idx].type}`)}
                        </Button>,
                        <Button key='submit' type='primary' disabled={error} onClick={this.handleOk}>
                            {this.props.t(`lwattempts_ok_button_${this.props.attempts[this.state.tx_idx].type}`)}
                        </Button>,
                    ]}
                >
                    {content}
                    <Row>
                        <Col span={8}/>
                        <Col span={8} style={{textAlign: 'center'}}>
                            <Pagination current={this.state.tx_idx + 1} total={max * 10} onChange={this.handleChange}/>
                        </Col>
                        <Col span={8}/>
                    </Row>
                </Modal>
            </div>
        );

    }
}
