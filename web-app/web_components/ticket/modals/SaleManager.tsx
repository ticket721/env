import * as React                                 from 'react';
import { StrapiTicket }                           from '@utils/strapi/ticket';
import { StrapiEvent }                            from '@utils/strapi/event';
import { StrapiMinter }                           from '@utils/strapi/minter';
import { StrapiMarketer }                         from '@utils/strapi/marketer';
import { FullPageLoader }                         from '@web_components/loaders/FullPageLoader';
import { ContractsSpecStore }                     from 'ethvtx/lib/state/contracts';
import { VtxContract }                            from 'ethvtx/lib/contracts/VtxContract';
import { AppState }                               from '@utils/redux/app_state';
import { getContract }                            from 'ethvtx/lib/contracts/helpers/getters';
import { Dispatch }                               from 'redux';
import { loadContractInstance, loadContractSpec } from 'ethvtx/lib/contracts/helpers/dispatchers';
import { connect }                                from 'react-redux';
import StaticTicketPreview                        from '@web_components/event/display/StaticTicketPreview';
import { to_ascii }                               from '@utils/misc/ascii';
import { Button, message, Typography }            from 'antd';
import { SaleData }                               from './OpenSaleModal';
import ContractArgumentForm
                                                  from '@web_views/events_overview/EventCreationForm/ContractArgumentForm';
import { sale }                               from '@web_contract_plugins/marketer/SaleMarketerController';
import { extras, overrides }                  from '@web_contract_plugins/marketer/MarketerSaleOverrides';
import { Tx }                                 from 'ethvtx/lib/state/txs';
import { getTransactionById }                 from 'ethvtx/lib/txs/helpers/getters';
import TxProgress                             from '@web_components/tx/TxProgress';
import { marketerBuildArgumentsConfigurator } from '../../../web_contract_plugins/marketer/marketerBuildArgumentsConfigurator';
import { theme }                              from '../../../utils/theme';
import { RGA }                                from '../../../utils/misc/ga';

export interface SaleManagerProps {
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

interface SaleManagerRState {
    specs: ContractsSpecStore;
    contract: VtxContract;
    strapi_url: string;
    infos: string[];
    get_tx: (tx_id: number) => Tx;
}

interface SaleManagerRDispatch {
    loadSpec: (name: string, abi: string, bin: string) => void;
    loadInstance: (name: string, address: string) => void;
}

type MergedSaleManagerProps = SaleManagerProps & SaleManagerRState & SaleManagerRDispatch;

interface SaleManagerState {
    argument_page: number;
    construction_id: number;
}

export class SaleManagerClass extends React.Component<MergedSaleManagerProps, SaleManagerState> {

    state: SaleManagerState = {
        argument_page: 0,
        construction_id: null
    };

    page_ready = (): boolean => {
        const args = this.props.contract_plugins.marketer.action_arguments.slice(this.state.argument_page * 2, (this.state.argument_page + 1) * 2);

        for (const argument of args) {
            if (!this.props.args.args[argument.name]) return false;
        }

        return true;

    }

    is_last = (): boolean =>
        (this.props.contract_plugins.marketer.action_arguments.length <= (this.state.argument_page + 1) * 2)

    next_page = (): void => {
        if (!this.is_last()) {
            this.setState({
                argument_page: this.state.argument_page + 1
            });
        }
    }

    previous_page = (): void => {
        if (this.state.argument_page > 0) {
            this.setState({
                argument_page: this.state.argument_page - 1
            });
        }
    }

    load_contract = (props: MergedSaleManagerProps): void => {

        if (props.specs && props.event && !props.contract) {
            if (!props.specs[props.event.eventcontract.name]) {
                props.loadSpec(props.event.eventcontract.name, props.event.eventcontract.abi, props.event.eventcontract.runtime_binary);
            }

            props.loadInstance(props.event.eventcontract.name, props.event.address.address);
        }

    }

    componentWillMount(): void {
        this.setState({
            construction_id: this.props.ticket.ticket_id
        });
    }

    componentDidMount(): void {
        this.load_contract(this.props);
        RGA.modalview(`/ticket/${this.props.ticket.ticket_id}/open_sale`);
    }

    shouldComponentUpdate(nextProps: Readonly<SaleManagerProps & SaleManagerRState & SaleManagerRDispatch>, nextState: Readonly<{}>, nextContext: any): boolean {

        this.load_contract(nextProps);

        return true;
    }

    on_ok = (): void => {
        if (this.props.contract_plugins.marketer && this.props.contract) {
            const result = sale(this.props.contract_plugins.marketer, this.props.ticket, this.props.coinbase, this.props.args.args, this.props.contract);

            if (result.error) {
                message.config({
                    top: 10,
                    duration: 2,
                    maxCount: 3,
                });
                message.error(this.props.t(result.error.message));
            }

            RGA.event({
                category: 'Tx - Open Ticket Sale',
                action: `[${this.state.construction_id}] Broadcast`,
            });

            this.props.set_tx(result.tx_id);

        }
    }

    get_buttons = (): React.ReactNode[] => {
        if (this.is_last()) {
            if (this.page_ready()) {
                return [
                    <Button key={0} onClick={this.previous_page} disabled={this.state.argument_page === 0}>
                        Previous
                    </Button>,
                    <Button key={1} onClick={this.on_ok} type='primary' style={{marginLeft: 12}}>
                        Sell
                    </Button>
                ];
            }
            return [
                <Button key={0} onClick={this.previous_page} disabled={this.state.argument_page === 0}>
                    Previous
                </Button>,
                <Button disabled={true} type='primary' key={1} style={{marginLeft: 12}}>
                    Sell
                </Button>
            ];
        } else {
            if (this.page_ready()) {
                return [
                    <Button key={0} onClick={this.previous_page} disabled={this.state.argument_page === 0}>
                        Previous
                    </Button>,
                    <Button key={1} type='primary' onClick={this.next_page} style={{marginLeft: 12}}>
                        Next
                    </Button>
                ];
            }
            return [
                <Button key={0} onClick={this.previous_page} disabled={this.state.argument_page === 0}>
                    Previous
                </Button>,
                <Button disabled={true} type='primary' key={1} style={{marginLeft: 12}}>
                    Next
                </Button>
            ];
        }
    }

    RGA_on_sale_confirming = (tx_hash: string): void => {
        RGA.event({
            category: 'Tx - Open Ticket Sale',
            action: `[${this.state.construction_id}] Confirming`,
            label: tx_hash
        });
    }

    RGA_on_sale_confirmed = (tx_hash: string): void => {
        RGA.event({
            category: 'Tx - Open Ticket Sale',
            action: `[${this.state.construction_id}] Confirmed`,
            label: tx_hash
        });
    }

    RGA_on_sale_error = (tx_hash?: string): void => {
        RGA.event({
            category: 'Tx - Open Ticket Sale',
            action: `[${this.state.construction_id}] Error`,
            label: tx_hash || 'none'
        });
    }

    render(): React.ReactNode {

        if (!this.props.contract_plugins.marketer || !this.props.contract) {
            return <FullPageLoader message={this.props.t('sale_modal_loading_marketer')}/>;
        }

        const current_args = this.props.contract_plugins.marketer.action_arguments.slice(this.state.argument_page * 2, (this.state.argument_page + 1) * 2);
        const buttons = this.get_buttons();

        return <div style={{width: 1400, height: 600}}>
            <div style={{width: '50%', height: '100%', float: 'left', borderRight: `1px solid ${theme.lightergrey}`}}>
                <div style={{height: '10%'}}>
                    <Typography.Text style={{fontSize: 42, color: theme.primary}}>{this.props.t('sale_modal_first_title')}</Typography.Text>
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
            {
                this.props.args.tx_id === null

                    ?
                    <div style={{width: '50%', height: '100%', float: 'left'}}>
                        <div style={{width: '90%', height: '10%', marginLeft: 24, marginBottom: '1%'}}>
                            <Typography.Text style={{fontSize: 42, color: theme.primary}}>{this.props.t('sale_modal_sell_form_title')}</Typography.Text>
                        </div>
                        <div style={{paddingLeft: '5%', width: '90%', height: '84%', overflow: 'auto'}}>
                            <div style={{backgroundColor: theme.event_filter_divider, padding: 24, borderRadius: 6}}>
                                <ContractArgumentForm
                                    arguments={
                                        this.props.contract_plugins.minter && this.props.contract

                                            ?
                                            marketerBuildArgumentsConfigurator(this.props.contract_plugins.marketer.name, current_args, {
                                                minter_name: this.props.contract_plugins.minter.name,
                                                minter: this.props.contract
                                            })
                                            :
                                            current_args
                                    }
                                    argument_values={this.props.args.args}
                                    overrides={overrides}
                                    extras={extras}
                                    name={this.props.contract_plugins.marketer.name}
                                    plugin_type={'marketers'}
                                    on_change={this.props.set_arg}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                height: '5%',
                                width: '90%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end'
                            }}
                        >
                            {buttons}
                        </div>
                    </div>

                    :
                    <div style={{width: '50%', height: 500, float: 'left'}}>
                        <TxProgress
                            t={this.props.t}
                            tx={this.props.get_tx(this.props.args.tx_id)}
                            scope='sale_modal'
                            route='marketplace'
                            confirmation_in_progress_call={this.RGA_on_sale_confirming}
                            confirmed_call={this.RGA_on_sale_confirmed}
                            error_call={this.RGA_on_sale_error}
                        />
                    </div>
            }
        </div>;
    }
}

const mapStateToProps = (state: AppState, ownProps: SaleManagerProps): SaleManagerRState => {

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

const mapDispatchToProps = (dispatch: Dispatch): SaleManagerRDispatch => ({
    loadSpec: (name: string, abi: string, bin: string): void => loadContractSpec(dispatch, name, abi, {bin}),
    loadInstance: (name: string, address: string): void => loadContractInstance(dispatch, name, address)
});

export default connect(mapStateToProps, mapDispatchToProps)(SaleManagerClass) as React.ComponentType<SaleManagerProps>;
