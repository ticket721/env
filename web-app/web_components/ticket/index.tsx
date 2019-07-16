import * as React                     from 'react';
import { StrapiTicket }               from '@utils/strapi/ticket';
import StrapiCall                     from '@components/strapi';
import { StrapiCallFn, StrapiHelper } from '@utils/StrapiHelper';
import { VtxContract }                from 'ethvtx/lib/contracts/VtxContract';
import { ContractsSpecStore }         from 'ethvtx/lib/state/contracts';
import { AppState }                   from '@utils/redux/app_state';
import { getContract }                from 'ethvtx/lib/contracts/helpers/getters';
import { connect }                    from 'react-redux';
import { Dispatch }                   from 'redux';
import {
    loadContractInstance,
    loadContractSpec,
    removeContractInstance
}                         from 'ethvtx/lib/contracts/helpers/dispatchers';
import LoadingTicket      from './LoadingTicket';
import Ticket             from './Ticket';
import { StrapiEvent }    from '@utils/strapi/event';
import { StrapiMinter }   from '@utils/strapi/minter';
import { to_ascii }       from '@utils/misc/ascii';
import { StrapiMarketer } from '@utils/strapi/marketer';

export interface IInputTicketReduxWrapperProps {
    strapi_event: StrapiEvent;
    contract_plugins: {
        minter: StrapiMinter;
        marketer: StrapiMarketer;
    };
    coinbase: string;
    show_marketplace_link?: boolean;
    always_hovered?: boolean;
}

export interface IReduxStateTicketReduxWrapperProps {
    event: VtxContract;
    specs: ContractsSpecStore;
    strapi_url: string;
    infos: string[];
}

export interface IReduxDispatchTicketReduxWrapperProps {
    addContractSpec: (name: string, abi: any[], bin: string) => void;
    addContract: (name: string, address: string) => void;
    removeContract: (name: string, address: string) => void;
}

class TicketReduxWrapper extends React.Component<IReduxStateTicketReduxWrapperProps & IReduxDispatchTicketReduxWrapperProps & IInputTicketProps & IInputTicketReduxWrapperProps> {

    contracts_check = (props: Readonly<IReduxStateTicketReduxWrapperProps & IReduxDispatchTicketReduxWrapperProps & IInputTicketProps & IInputTicketReduxWrapperProps>): void => {
        if (!props.event && props.specs && props.strapi_event.eventcontract && props.strapi_event.address && props.addContractSpec && props.addContract) {

            if (!props.specs[props.strapi_event.eventcontract.name]) {
                props.addContractSpec(props.strapi_event.eventcontract.name, props.strapi_event.eventcontract.abi, props.strapi_event.eventcontract.runtime_binary);
            }

            props.addContract(props.strapi_event.eventcontract.name, props.strapi_event.address.address);
        }

    }

    componentDidMount(): void {
        this.contracts_check(this.props);
    }

    shouldComponentUpdate(nextProps: Readonly<IReduxStateTicketReduxWrapperProps & IReduxDispatchTicketReduxWrapperProps & IInputTicketProps & IInputTicketReduxWrapperProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        this.contracts_check(nextProps);
        return true;
    }

    componentWillUnmount(): void {
        if (this.props.event) {
            // TODO Fix this crash
            // this.props.removeContract(this.props.event_contract_type.name, this.props.event_address.address);
        }
    }

    render(): React.ReactNode {
        if (!this.props.event || !this.props.infos) {
            return <LoadingTicket/>;
        }
        return <Ticket
            event={this.props.strapi_event}
            strapi_url={this.props.strapi_url}
            ticket={this.props.ticket}
            ticket_infos={this.props.infos}
            contract_plugins={this.props.contract_plugins}
            coinbase={this.props.coinbase}
            show_marketplace_link={this.props.show_marketplace_link}
            always_hovered={this.props.always_hovered}
        />;
    }
}

const mapStateToProps = (state: AppState, ownProps: IInputTicketReduxWrapperProps & IInputTicketProps): IReduxStateTicketReduxWrapperProps => {

    const contract = getContract(state, ownProps.strapi_event.eventcontract.name, ownProps.strapi_event.address.address);

    let infos;
    if (contract) {
        infos = contract.fn.getTicketInfos(ownProps.ticket.ticket_id);
        if (infos) {
            infos = infos.map((info: string): string => to_ascii(info));
        }
    }

    return {
        event: contract,
        specs: state.contracts.specs,
        strapi_url: state.app.config.strapi_endpoint,
        infos
    };
};

const mapDispatchToProps = (dispatch: Dispatch): IReduxDispatchTicketReduxWrapperProps => ({
    addContractSpec: (name: string, abi: any[], bin: string): void => loadContractSpec(dispatch, name, abi, {bin}),
    addContract: (name: string, address: string): void => loadContractInstance(dispatch, name, address),
    removeContract: (name: string, address: string): void => removeContractInstance(dispatch, name, address)
});

const WrappedTicketReduxWrapper: React.ComponentType<IInputTicketReduxWrapperProps & IInputTicketProps> = connect(mapStateToProps, mapDispatchToProps)(TicketReduxWrapper);

export interface IInputTicketProps {
    ticket: StrapiTicket;
    coinbase: string;
    show_marketplace_link?: boolean;
    always_hovered?: boolean;
}

const filter_strapi = (entities: any[]): any[] => {

    // Removing Errored entities
    let real_entities;
    if (entities) {
        real_entities = [];
        for (const entity of entities) {
            if (entity.data) {
                real_entities.push(entity.data);
            }
        }
    } else {
        real_entities = entities;
    }

    return real_entities;
};

// tslint:disable-next-line:max-classes-per-file
export default class TicketStrapiWrapper extends React.Component<IInputTicketProps> {

    render(): React.ReactNode {
        return <StrapiCall
            calls={{
                event: StrapiHelper.getEntry('events', this.props.ticket.event.id),
                marketer: {
                    call: (arg: any): StrapiCallFn => StrapiHelper.getEntry('marketers', arg.eventcontract.marketer),
                    requires: 'event',
                    converter: (event: any): any => {
                        if (event && event.length && event[0].data) {
                            return event[0].data;
                        }
                        return null;
                    }
                },
                minter: {
                    call: (arg: any): StrapiCallFn => StrapiHelper.getEntry('minters', arg.eventcontract.minter),
                    requires: 'event',
                    converter: (event: any): any => {
                        if (event && event.length && event[0].data) {
                            return event[0].data;
                        }
                        return null;
                    }
                }
            }}
        >
            {
                ({event, minter, marketer}: any): React.ReactNode => {

                    event = filter_strapi(event);
                    minter = filter_strapi(minter);
                    marketer = filter_strapi(marketer);

                    if (event && minter && marketer) {
                        return <WrappedTicketReduxWrapper
                            strapi_event={event[0]}
                            ticket={this.props.ticket}
                            contract_plugins={{
                                minter: minter[0],
                                marketer: marketer[0]
                            }}
                            coinbase={this.props.coinbase}
                            show_marketplace_link={this.props.show_marketplace_link}
                            always_hovered={this.props.always_hovered}
                        />;
                    }

                    return <LoadingTicket/>;

                }}
        </StrapiCall>;
    }
}
