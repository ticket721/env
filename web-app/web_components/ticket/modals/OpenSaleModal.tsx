import * as React          from 'react';
import { Button, Modal }   from 'antd';
import { StrapiTicket }    from '@utils/strapi/ticket';
import { StrapiMarketer }  from '../../../utils/strapi/marketer';
import { StrapiEvent }     from '../../../utils/strapi/event';
import { StrapiMinter }    from '../../../utils/strapi/minter';
import SaleManager         from './SaleManager';
import { I18N, I18NProps } from '../../../utils/misc/i18n';
import { theme }           from '../../../utils/theme';

export interface OpenSaleModalProps {
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

type MergedOpenSaleModalProps = OpenSaleModalProps & I18NProps;

export interface SaleData {
    args: any;
    tx_id: number;
}

interface OpenSaleModalState {
    input_args: SaleData;
}

class OpenSaleModal extends React.Component<MergedOpenSaleModalProps, OpenSaleModalState> {

    state: OpenSaleModalState = {
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
                .sale_modal .ant-modal-header {
                    background-color: ${theme.dark2};
                }
                
                .sale_modal .ant-modal-title {
                    color: ${theme.white};
                }
                
                .sale_modal .ant-modal-close-x {
                    color: ${theme.white};
                }
            `}</style>
            <Modal
                width={1400}
                wrapClassName='sale_modal'
                title={this.props.t('sale_modal_title')}
                visible={this.props.visible}
                onCancel={this.on_close}
                destroyOnClose={true}
                footer={[
                    <Button key='back' onClick={this.on_close}>
                        {this.props.t('sale_modal_cancel_button')}
                    </Button>,
                ]}
            >
                <SaleManager
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

export default I18N.withNamespaces(['tickets'])(OpenSaleModal) as React.ComponentType<OpenSaleModalProps>;
