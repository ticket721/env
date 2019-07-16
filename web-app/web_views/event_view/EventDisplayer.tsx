import { VtxContract }         from 'ethvtx/lib/contracts/VtxContract';
import { StrapiAddress }       from '@utils/strapi/address';
import { StrapiEvent }         from '@utils/strapi/event';
import { StrapiEventContract } from '@utils/strapi/eventcontract';
import { ContractsSpecStore }  from 'ethvtx/lib/state/contracts';
import { AppState }            from '@utils/redux/app_state';
import { getContract }         from 'ethvtx/lib/contracts/helpers/getters';
import { Dispatch }            from 'redux';
import {
    loadContractInstance,
    loadContractSpec,
    removeContractInstance
}                              from 'ethvtx/lib/contracts/helpers/dispatchers';
import { connect }          from 'react-redux';
import * as React           from 'react';
import EventImages           from './EventImages';
import EventInformationGrid  from './EventInformationGrid';
import EventTicketsGrid      from './EventTicketsGrid';
import { StrapiMinter }      from '@utils/strapi/minter';
import { StrapiMarketer }    from '@utils/strapi/marketer';
import { StrapiApprover }    from '@utils/strapi/approver';
import EventActivityGrid     from './EventActivityGrid';
import { theme }             from '../../utils/theme';
import EventEditInformations from './EventEditInformations';
import EventEditCancel       from './EventEditCancel';
import { Divider }           from 'antd';
import EventFundsGrid        from './EventFundsGrid';
import { RGA }               from '../../utils/misc/ga';

// Props

export interface EventDisplayerProps {
    coinbase: StrapiAddress;
    address: StrapiAddress;
    event: StrapiEvent;
    event_type: StrapiEventContract;
    strapi_url: string;
}

interface EventDisplayerRState {
    contract: VtxContract;
    specs: ContractsSpecStore;
}

interface EventDisplayerRDispatch {
    addSpec: (name: string, abi: any[], bin: string, constructor_bin: string) => void;
    addInstance: (name: string, address: string) => void;
    removeInstance: (name: string, address: string) => void;
}

interface EventDisplayerState {
    edit: boolean;
}

type MergedEventDisplayerProps = EventDisplayerProps & EventDisplayerRState & EventDisplayerRDispatch;

class EventDisplayer extends React.Component<MergedEventDisplayerProps, EventDisplayerState> {

    state: EventDisplayerState = {
        edit: false
    };

    componentDidMount(): void {

        if (this.props.event && this.props.specs && this.props.addSpec && this.props.event_type && this.props.address && !this.props.contract) {

            if (this.props.specs[this.props.event_type.name] === undefined) {
                this.props.addSpec(this.props.event_type.name, this.props.event_type.abi, this.props.event_type.runtime_binary, this.props.event_type.binary);
            }

            this.props.addInstance(this.props.event_type.name, this.props.address.address);

        }
    }

    shouldComponentUpdate(nextProps: Readonly<MergedEventDisplayerProps>, nextState: Readonly<{}>, nextContext: any): boolean {

        if (nextProps.event && nextProps.specs && nextProps.addSpec && nextProps.event_type && nextProps.address && !nextProps.contract) {

            if (nextProps.specs[nextProps.event_type.name] === undefined) {
                nextProps.addSpec(nextProps.event_type.name, nextProps.event_type.abi, nextProps.event_type.runtime_binary, nextProps.event_type.binary);
            }

            nextProps.addInstance(nextProps.event_type.name, nextProps.address.address);

        }

        return true;
    }

    componentWillUnmount(): void {
        if (this.props.contract && this.props.event_type && this.props.address) {
            this.props.removeInstance(this.props.event_type.name, this.props.address.address);
        }
    }

    edit = (): void => {
        if (!this.state.edit) {
            RGA.event({category: 'User', action: 'Open Edit Form'});
        }
        this.setState({
            edit: !this.state.edit
        });
    }

    render(): React.ReactNode {
        if (this.state.edit) {
            return <div style={{width: '100%', height: '100%', marginTop: -24, marginBottom: -24, paddingTop: 24, paddingBottom: 24}}>
                <div style={{width: '100%', backgroundColor: theme.white, padding: 24, borderRadius: 5}}>
                    <EventEditCancel cancel={this.edit}/>
                    <Divider/>
                    <EventEditInformations event={this.props.event} cancel={this.edit}/>
                </div>
            </div>;
        }
        return <div style={{width: '100%', height: '100%'}}>
            <EventImages
                event={this.props.event}
                strapi_url={this.props.strapi_url}
                user_address={this.props.coinbase ? this.props.coinbase.address : null}
                edit_trigger={this.edit}
            />
            <EventInformationGrid event={this.props.event}/>
            <EventTicketsGrid
                address={this.props.address}
                minter={this.props.event_type.minter as StrapiMinter}
                marketer={this.props.event_type.marketer as StrapiMarketer}
                approver={this.props.event_type.approver as StrapiApprover}
                event={this.props.event}
                contract={this.props.contract}
                strapi_url={this.props.strapi_url}
            />
            <EventFundsGrid
                event={this.props.event}
                coinbase={this.props.coinbase}
                contract={this.props.contract}
            />
            <EventActivityGrid
                event={this.props.event}
                address={this.props.address}
            />
        </div>;
    }
}

const mapStateToProps = (state: AppState, ownProps: EventDisplayerProps): EventDisplayerRState => ({
    specs: state.contracts.specs,
    contract: ownProps.event && ownProps.address ? getContract(state, ownProps.event_type.name, ownProps.address.address) : undefined,
});

const mapDispatchToProps = (dispatch: Dispatch): EventDisplayerRDispatch =>
    ({
        addSpec: (name: string, abi: any[], bin: string, constructor_bin: string): void => loadContractSpec(dispatch, name, abi, {
            bin,
            constructor_bin
        }),
        addInstance: (name: string, address: string): void => loadContractInstance(dispatch, name, address, {
            balance: true
        }),
        removeInstance: (name: string, address: string): void => removeContractInstance(dispatch, name, address)
    });

export default connect(mapStateToProps, mapDispatchToProps)(EventDisplayer);
