import * as React          from 'react';
import { Button, Modal }   from 'antd';
import { StrapiTicket }    from '@utils/strapi/ticket';
import { StrapiMarketer }  from '../../../utils/strapi/marketer';
import { StrapiEvent }     from '../../../utils/strapi/event';
import { StrapiMinter }    from '../../../utils/strapi/minter';
import { I18N, I18NProps } from '../../../utils/misc/i18n';
import BuyManager          from './BuyManager';
import { theme }           from '../../../utils/theme';

export interface BuyModalProps {
    ticket: StrapiTicket;
    event: StrapiEvent;
    contract_plugins: {
        minter: StrapiMinter;
        marketer: StrapiMarketer;
    };
    visible: boolean;
    close: () => void;
    coinbase: string;
}

type MergedBuyModalProps = BuyModalProps & I18NProps;

export interface BuyData {
    args: any;
    tx_id: number;
}

interface BuyModalState {
    input_args: BuyData;
}

class CloseSaleModal extends React.Component<MergedBuyModalProps, BuyModalState> {

    state: BuyModalState = {
        input_args: {
            args: {},
            tx_id: null
        }
    };

    set_arg = (name: string, value: any): void => {
        this.setState({
            input_args: {
                ...this.state.input_args,
                args: {
                    ...this.state.input_args.args,
                    [name]: value
                }
            }
        });
    }

    set_tx = (tx_id: number): void => {
        this.setState({
            input_args: {
                ...this.state.input_args,
                tx_id
            }
        });
    }

    on_close = (): void => {
        this.setState({
            input_args: {
                args: {},
                tx_id: null
            }
        });
        this.props.close();
    }

    render(): React.ReactNode {

        return <div>
            <style>{`
                .buy_modal .ant-modal-header {
                    background-color: ${theme.dark2};
                }
                
                .buy_modal .ant-modal-title {
                    color: ${theme.white};
                }
                
                .buy_modal .ant-modal-close-x {
                    color: ${theme.white};
                }
            `}</style>
            <Modal
                width={1400}
                wrapClassName='buy_modal'
                title={this.props.t('buy_modal_title')}
                visible={this.props.visible}
                onCancel={this.on_close}
                destroyOnClose={true}
                footer={[
                    <Button key='back' onClick={this.on_close}>
                        {this.props.t('buy_modal_cancel_button')}
                    </Button>,
                ]}
            >
                <BuyManager
                    ticket={this.props.ticket}
                    event={this.props.event}
                    contract_plugins={this.props.contract_plugins}
                    set_arg={this.set_arg}
                    set_tx={this.set_tx}
                    args={this.state.input_args}
                    t={this.props.t}
                    coinbase={this.props.coinbase}
                />
            </Modal>
        </div>;

    }

}

export default I18N.withNamespaces(['tickets'])(CloseSaleModal) as React.ComponentType<BuyModalProps>;
