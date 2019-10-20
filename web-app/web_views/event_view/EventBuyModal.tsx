import * as React             from 'react';
import { Button, Modal }      from 'antd';
import EventBuyModalContent   from './EventBuyModalContent';
import { TicketCategory }     from '@web_contract_plugins/minter/MinterCategoriesGetter';
import { StrapiAddress }      from '@utils/strapi/address';
import { StrapiEvent }        from '@utils/strapi/event';
import MintingController      from '@web_contract_plugins/minter/MintingController';
import { StrapiMinter }       from '@utils/strapi/minter';
import { VtxContract }        from 'ethvtx/lib/contracts/VtxContract';
import { Tx }                 from 'ethvtx/lib/state/txs';
import { AppState }           from '@utils/redux/app_state';
import { getTransactionById } from 'ethvtx/lib/txs/helpers/getters';
import { connect }            from 'react-redux';
import { theme }              from '../../utils/theme';
import { RGA }                from '../../utils/misc/ga';

// Props

export interface EventBuyModalProps {
    buy_modal_visible: boolean;
    set_visibility_false: () => void;
    categories: TicketCategory[];
    selection: number;
    price_selection: string;
    strapi_url: string;
    address: StrapiAddress;
    event: StrapiEvent;
    minter: StrapiMinter;
    contract: VtxContract;
    coinbase: string;
    mint_count: number;
    t: any;
}

interface EventBuyModalRState {
    get_tx: (tx_id: number) => Tx;
}

type MergedEventBuyModalProps = EventBuyModalProps & EventBuyModalRState;

interface EventBuyModalState {
    tx_id: number;
}

class EventBuyModal extends React.Component<MergedEventBuyModalProps, EventBuyModalState> {

    state: EventBuyModalState = {
        tx_id: null
    };

    close_catcher = (): void => {
        this.setState({
            tx_id: null
        });

        this.props.set_visibility_false();
    }

    ended = (): boolean =>
        (this.props.categories
            && this.props.categories.length
            && this.props.selection !== null
            && this.props.categories[this.props.selection].end.getTime() < Date.now())

    sold_out = (): boolean =>
        (this.props.categories
            && this.props.categories.length
            && this.props.selection !== null
            && this.props.categories[this.props.selection].bought === this.props.categories[this.props.selection].supply)

    get_current_actions = (tx: Tx): any => {
        if  (this.ended()) {
            return {
                button_title: 'buy_modal_sale_ended_button',
                button_disabled: true,
                button_loading: false
            };
        }
        if (this.sold_out()) {
            return {
                button_title: 'buy_modal_sale_sold_out',
                button_disabled: true,
                button_loading: false
            };
        }

        if (this.state.tx_id === null) {
            return {
                button_title: 'buy_modal_buy_button',
                button_disabled: false,
                button_loading: false
            };
        } else {
            if (tx && tx.status === 'Confirmed') {
                return {
                    button_title: 'buy_modal_tx_confirmed_button',
                    button_disabled: true,
                    button_loading: false
                };
            }
            return {
                button_title: 'buy_modal_tx_pending_button',
                button_disabled: true,
                button_loading: true
            };
        }
    }

    on_action = (): any => {
        if (this.state.tx_id === null && this.props.price_selection && this.props.minter) {
            const price = this.props.categories && this.props.categories.length && this.props.selection !== null && this.props.price_selection !== null ? this.props.categories[this.props.selection].price[this.props.price_selection] : null;
            if (MintingController[this.props.price_selection] && MintingController[this.props.price_selection][this.props.minter.name] && price) {

                const tx_id = MintingController[this.props.price_selection][this.props.minter.name](this.props.contract, this.props.coinbase, price, this.props.categories[this.props.selection].name);

                RGA.event({
                    category: 'Tx - Ticket Purchase',
                    action: `[${this.props.event.address.address}] Broadcast`,
                });

                this.setState({
                    tx_id
                });
            }
        }
    }

    render(): React.ReactNode {

        const tx = this.state.tx_id !== null ? this.props.get_tx(this.state.tx_id) : undefined;
        const status = this.get_current_actions(tx);

        return <div id='buy_modal'>
            <style>{`
                .buy_modal .ant-modal-content {
                    height: 100%;
                }
                .buy_modal .ant-modal-header {
                    background-color: ${theme.dark0};
                }
                .buy_modal .ant-modal-close-x {
                    color: ${theme.white};
                }
                .buy_modal .ant-modal-title {
                    color: ${theme.white};
                }
                .buy_modal .ant-list-item-meta-description .ant-typography {
                    color: ${theme.dark2};
                }
                .buy_modal .ant-list-item-meta-title {
                    color: ${theme.primary};
                    font-weigth: 300;
                    font-size: 16px;
                }
                .buy_modal .ant-list-item-meta-description {
                    text-align: center;
                    margin-bottom: 12px;
                }
                `}</style>
            <Modal
                wrapClassName={'buy_modal'}
                title={this.props.t('buy_modal_title')}
                visible={this.props.buy_modal_visible}
                onOk={this.on_action}
                onCancel={this.close_catcher}
                width={1200}
                footer={[
                    <Button key='back' onClick={this.close_catcher}>{this.props.t('buy_modal_cancel_button')}</Button>,
                    <Button key='submit' type='primary' onClick={this.on_action} loading={status.button_loading} disabled={this.props.mint_count > 0 || status.button_disabled}>
                        {this.props.t(status.button_title)}
                    </Button>
                ]}
            >
                <EventBuyModalContent
                    category={this.props.categories ? this.props.categories[this.props.selection] : null}
                    strapi_url={this.props.strapi_url}
                    address={this.props.address}
                    event={this.props.event}
                    price_selection={this.props.price_selection}
                    t={this.props.t}
                    tx_id={this.state.tx_id}
                    tx={tx}
                    ended={this.ended()}
                    sold_out={this.sold_out()}
                    mint_count={this.props.mint_count}
                />
            </Modal>
        </div>;

    }
}

const mapStateToProps = (state: AppState): EventBuyModalRState => ({
    get_tx: (tx_id: number): Tx => getTransactionById(state, tx_id)
});

export default connect(mapStateToProps)(EventBuyModal);
