import * as React                                 from 'react';
import { StrapiTicket }                           from '@utils/strapi/ticket';
import { StrapiEvent }                            from '@utils/strapi/event';
import { StrapiMinter }                           from '@utils/strapi/minter';
import { StrapiMarketer }                         from '@utils/strapi/marketer';
import { FullPageLoader }                         from '@web_components/loaders/FullPageLoader';
import { ContractsSpecStore }                     from 'ethvtx/lib/state/contracts';
import { VtxContract }                            from 'ethvtx/lib/contracts/VtxContract';
import { AppState }                               from '@utils/redux/app_state';
import { getContract }                                  from 'ethvtx/lib/contracts/helpers/getters';
import { Dispatch }                                     from 'redux';
import { loadContractInstance, loadContractSpec }       from 'ethvtx/lib/contracts/helpers/dispatchers';
import { connect }                                      from 'react-redux';
import StaticTicketPreview                              from '@web_components/event/display/StaticTicketPreview';
import { to_ascii }                                     from '@utils/misc/ascii';
import { Button, Divider, message, Select, Typography } from 'antd';
import { SaleData }                                     from './OpenSaleModal';
import { buy }                                          from '@web_contract_plugins/marketer/BuyMarketerController';
import { Tx }                 from 'ethvtx/lib/state/txs';
import { getTransactionById } from 'ethvtx/lib/txs/helpers/getters';
import TxProgress             from '@web_components/tx/TxProgress';
import Address                from '@components/address';
import currencies             from '@utils/currencies';
import { theme }              from '../../../utils/theme';
import { RGA }                from '../../../utils/misc/ga';

const Option = Select.Option;

export interface BuyManagerProps {
    ticket: StrapiTicket;
    event: StrapiEvent;
    coinbase: string;
    contract_plugins: {
        minter: StrapiMinter;
        marketer: StrapiMarketer;
    };
    t: any;
    args: SaleData;
    set_arg: (name: string, value: any) => void;
    set_tx: (tx_id: number) => void;
}

interface BuyManagerRState {
    specs: ContractsSpecStore;
    contract: VtxContract;
    strapi_url: string;
    infos: string[];
    get_tx: (tx_id: number) => Tx;
}

interface BuyManagerRDispatch {
    loadSpec: (name: string, abi: string, bin: string) => void;
    loadInstance: (name: string, address: string) => void;
}

type MergedBuyManagerProps = BuyManagerProps & BuyManagerRState & BuyManagerRDispatch;

interface BuyManagerState {
    argument_page: number;
    currency: string;
    construction_id: number;
}

export class BuyManagerClass extends React.Component<MergedBuyManagerProps, BuyManagerState> {

    state: BuyManagerState = {
        argument_page: 0,
        currency: null,
        construction_id: null
    };

    // If args will be supported
    page_ready = (): boolean => {
        const args = this.props.contract_plugins.marketer.action_arguments.slice(this.state.argument_page * 2, (this.state.argument_page + 1) * 2);

        for (const argument of args) {
            if (!this.props.args.args[argument.name]) return false;
        }

        return true;

    }

    // If args will be supported
    is_last = (): boolean =>
        (this.props.contract_plugins.marketer.action_arguments.length <= (this.state.argument_page + 1) * 2)

    // If args will be supported
    next_page = (): void => {
        if (!this.is_last()) {
            this.setState({
                argument_page: this.state.argument_page + 1
            });
        }
    }

    // If args will be supported
    previous_page = (): void => {
        if (this.state.argument_page > 0) {
            this.setState({
                argument_page: this.state.argument_page - 1
            });
        }
    }

    load_contract = (props: MergedBuyManagerProps): void => {

        if (props.specs && props.event && !props.contract) {

            if (!props.specs[props.event.eventcontract.name]) {
                props.loadSpec(props.event.eventcontract.name, props.event.eventcontract.abi, props.event.eventcontract.runtime_binary);
            }

            props.loadInstance(props.event.eventcontract.name, props.event.address.address);
        }

    }

    componentDidMount(): void {
        this.load_contract(this.props);
        RGA.modalview(`/ticket/${this.props.ticket.ticket_id}/buy`);
    }

    componentWillMount(): void {
        this.setState({
            construction_id: this.props.ticket.ticket_id
        });
    }

    componentWillUnmount(): void {
        this.setState({
            currency: null
        });
    }

    shouldComponentUpdate(nextProps: Readonly<BuyManagerProps & BuyManagerRState & BuyManagerRDispatch>, nextState: Readonly<{}>, nextContext: any): boolean {

        this.load_contract(nextProps);

        return true;
    }

    // If args will be supported
    on_ok = (): void => {
        if (this.props.contract_plugins.marketer && this.props.contract && this.state.currency !== null) {

            const price_idx = this.props.ticket.current_sale.prices.findIndex((price: any): boolean => price.currency === this.state.currency);

            if (price_idx === -1) return ;

            const price = this.props.ticket.current_sale.prices[price_idx];

            const result = buy(this.props.contract_plugins.marketer, this.props.ticket, this.props.coinbase, this.props.args.args, this.props.contract, price);

            if (result.error) {
                message.config({
                    top: 10,
                    duration: 2,
                    maxCount: 3,
                });
                message.error(this.props.t(result.error.message));
            }

            RGA.event({
                category: 'Tx - Ticket Buy',
                action: `[${this.props.ticket.ticket_id}] Broadcast`,
            });
            this.props.set_tx(result.tx_id);

        }
    }

    currency_change = (selection: string): void => {
        this.setState({
            currency: selection
        });
    }

    RGA_on_buy_confirming = (tx_hash: string): void => {
        RGA.event({
            category: 'Tx - Ticket Buy',
            action: `[${this.state.construction_id}] Confirming`,
            label: tx_hash
        });
    }

    RGA_on_buy_confirmed = (tx_hash: string): void => {
        RGA.event({
            category: 'Tx - Ticket Buy',
            action: `[${this.state.construction_id}] Confirmed`,
            label: tx_hash
        });
    }

    RGA_on_buy_error = (tx_hash?: string): void => {
        RGA.event({
            category: 'Tx - Ticket Buy',
            action: `[${this.state.construction_id}] Error`,
            label: tx_hash || 'none'
        });
    }

    render(): React.ReactNode {

        if (!this.props.contract_plugins.marketer || !this.props.contract) {
            return <FullPageLoader message={this.props.t('buy_modal_loading_marketer')}/>;
        }

        let Symbol = null;
        let Fixed = null;

        if (this.state.currency !== null) {

            const selection_idx = this.props.ticket.current_sale.prices.findIndex((price: any): boolean => price.currency === this.state.currency);

            if (selection_idx !== -1) {
                Symbol = currencies[this.state.currency].symbol({fontSize: 62});
                Fixed = currencies[this.state.currency].toFixed(this.props.ticket.current_sale.prices[selection_idx].value);
            }
        }

        const currency_options = this.props.ticket.current_sale.prices.map((sale: any, idx: number): React.ReactNode => <Option value={sale.currency} key={idx}>{sale.currency}</Option>);

        return <div style={{width: 1400, height: 600}}>
            {
                this.props.args.tx_id === null

                    ?
                    <div style={{width: '100%', height: '100%'}}>
                        <div style={{width: '50%', height: '100%', float: 'left', borderRight: `1px solid ${theme.lightergrey}`}}>
                            <div style={{height: '10%'}}>
                                <Typography.Text style={{fontSize: 42, color: theme.primary}}>{this.props.t('buy_modal_first_title')}</Typography.Text>
                            </div>
                            <div style={{height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <StaticTicketPreview
                                    image={this.props.event.image}
                                    event_address={this.props.event.address.address}
                                    name={this.props.event.name}
                                    strapi_url={this.props.strapi_url}
                                    infos={this.props.infos}
                                    event_begin={this.props.event.start}
                                    id={this.props.ticket.ticket_id}
                                />
                            </div>
                        </div>
                        <div style={{width: '50%', height: '100%', float: 'left'}}>
                            <div style={{width: '90%', height: '10%', marginLeft: 24, marginBottom: '1%'}}>
                                <Typography.Text style={{fontSize: 42, color: theme.primary}}>{this.props.t('buy_modal_buy_title')}</Typography.Text>
                            </div>
                            <br/>
                            <Divider style={{width: '90%', minWidth: '90%', marginLeft: 12}}/>
                            <div style={{width: '90%', height: '30%', marginLeft: 48}}>
                                <Typography.Text style={{fontSize: 26, color: theme.dark2}}>{this.props.t('buy_modal_seller')}</Typography.Text>
                                <br/>
                                <div style={{marginLeft: 24}}>
                                    <Address address={this.props.ticket.owner} size={18} color={theme.dark2}/>
                                </div>
                                <br/>
                                <Typography.Text style={{fontSize: 26, color: theme.dark2}}>{this.props.t('buy_modal_event')}</Typography.Text>
                                <br/>
                                <div style={{marginLeft: 24}}>
                                    <Typography.Text style={{fontSize: 18, color: theme.dark2}}>{this.props.ticket.event.name}</Typography.Text>
                                </div>
                            </div>
                            <Divider style={{width: '90%', minWidth: '90%', marginLeft: 12}}/>
                            <div style={{width: '90%', height: '35%', marginLeft: 24, textAlign: 'center'}}>
                                <Select style={{width: '50%'}} onChange={this.currency_change} placeholder={this.props.t('buy_modal_payment_method')} value={this.state.currency}>
                                    {currency_options}
                                </Select>
                                <div style={{height: '50%', width: '100%', marginTop: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {
                                        Symbol && Fixed

                                            ?
                                            <div>
                                                {Symbol}  <Typography.Text style={{fontSize: 62}}>{Fixed}</Typography.Text>
                                            </div>

                                            :
                                            null
                                    }
                                </div>
                                {
                                    this.state.currency !== null

                                        ?
                                        <Button
                                            key={0}
                                            type='primary'
                                            onClick={this.on_ok}
                                        >
                                            {this.props.t('buy_modal_buy_button')}
                                        </Button>

                                        :
                                        null
                                }
                            </div>

                        </div>
                    </div>

                    :
                    <div style={{width: '100%', height: 500, float: 'left'}}>
                        <TxProgress
                            t={this.props.t}
                            tx={this.props.get_tx(this.props.args.tx_id)}
                            scope='buy_modal'
                            route='account'
                            confirmation_in_progress_call={this.RGA_on_buy_confirming}
                            confirmed_call={this.RGA_on_buy_confirmed}
                            error_call={this.RGA_on_buy_error}
                        />
                    </div>
            }
        </div>;
    }
}

const mapStateToProps = (state: AppState, ownProps: BuyManagerProps): BuyManagerRState => {

    const contract = ownProps.event ? getContract(state, ownProps.event.eventcontract.name, ownProps.event.address.address) : undefined;

    let infos;
    if (contract) {
        infos = contract.fn.getTicketInfos(ownProps.ticket.ticket_id);
        if (infos) {
            infos = infos.map((info: string): string => to_ascii(info));
        }
    }

    return {
        infos,
        specs: state.contracts.specs,
        contract: contract,
        strapi_url: state.app.config.strapi_endpoint,
        get_tx: (tx_id: number): Tx => getTransactionById(state, tx_id)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): BuyManagerRDispatch => ({
    loadSpec: (name: string, abi: string, bin: string): void => loadContractSpec(dispatch, name, abi, {bin}),
    loadInstance: (name: string, address: string): void => loadContractInstance(dispatch, name, address),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyManagerClass) as React.ComponentType<BuyManagerProps>;
