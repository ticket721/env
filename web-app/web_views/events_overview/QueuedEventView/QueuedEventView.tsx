import * as React                 from 'react';
import { StrapiAddress }          from '@utils/strapi/address';
import { StrapiMinter }           from '@utils/strapi/minter';
import { StrapiMarketer }         from '@utils/strapi/marketer';
import { StrapiApprover }         from '@utils/strapi/approver';
import { StrapiQueuedEvent }      from '@utils/strapi/queuedevent';
import { VtxContract }            from 'ethvtx/lib/contracts/VtxContract';
import { ContractsSpecStore }     from 'ethvtx/lib/state/contracts';
import { AppState }               from '@utils/redux/app_state';
import { connect }                from 'react-redux';
import { Dispatch }               from 'redux';
import {
    loadContractInstance,
    loadContractSpec,
    removeContractInstance
}                                 from 'ethvtx/lib/contracts/helpers/dispatchers';
import { getContract }            from 'ethvtx/lib/contracts/helpers/getters';
import { FullPageLoader }          from '@web_components/loaders/FullPageLoader';
import QueuedEventImages           from './QueuedEventImages';
import QueuedEventWarning          from './QueuedEventWarning';
import QueuedEventInformationGrid  from './QueuedEventInformationGrid';
import QueuedEventTicketsGrid      from './QueuedEventTicketsGrid';
import { Divider }                 from 'antd';
import { theme }                   from '../../../utils/theme';
import QueuedEventEditCancel       from './QueuedEventEditCancel';
import QueuedEventEditInformations from './QueuedEventEditInformations';

// Props

export interface QueuedEventViewProps {
    address: string;
    coinbase: StrapiAddress;
    minters: StrapiMinter[];
    marketers: StrapiMarketer[];
    approvers: StrapiApprover[];
    queued_event: StrapiQueuedEvent;
}

interface QueuedEventViewRState {
    contract: VtxContract;
    specs: ContractsSpecStore;
    strapi_url: string;
}

interface QueuedEventViewRDispatch {
    addSpec?: (name: string, abi: any[], bin: string, constructor_bin: string) => void;
    addInstance?: (name: string, address: string) => void;
    removeInstance?: (name: string, address: string) => void;
}

type MergedQueuedEventViewProps = QueuedEventViewProps & QueuedEventViewRState & QueuedEventViewRDispatch;

interface QueuedEventViewState {
    preview: boolean;
}

class QueuedEventView extends React.Component<MergedQueuedEventViewProps, QueuedEventViewState> {

    state: QueuedEventViewState = {
        preview: true
    };

    edit_mode_on = (): void => {
        this.setState({
            preview: false
        });
    }

    edit_mode_off = (): void => {
        this.setState({
            preview: true
        });
    }

    start_sale = (): void => {
        if (this.props.contract && this.props.coinbase) {
            this.props.contract.fn.start({
                from: this.props.coinbase.address
            });
        }
    }

    componentDidMount(): void {

        if (this.props.queued_event && this.props.specs && this.props.addSpec && !this.props.contract) {

            if (this.props.specs[this.props.queued_event.type.name] === undefined) {
                this.props.addSpec(this.props.queued_event.type.name, this.props.queued_event.type.abi, this.props.queued_event.type.runtime_binary, this.props.queued_event.type.binary);
            }

            this.props.addInstance(this.props.queued_event.type.name, this.props.queued_event.address);

        }

    }

    shouldComponentUpdate(nextProps: Readonly<MergedQueuedEventViewProps>, nextState: Readonly<{}>, nextContext: any): boolean {

        if (nextProps.queued_event && nextProps.specs && nextProps.addSpec && !nextProps.contract) {

            if (nextProps.specs[nextProps.queued_event.type.name] === undefined) {
                nextProps.addSpec(nextProps.queued_event.type.name, nextProps.queued_event.type.abi, nextProps.queued_event.type.runtime_binary, nextProps.queued_event.type.binary);
            }

            nextProps.addInstance(nextProps.queued_event.type.name, nextProps.queued_event.address);

        }

        return true;
    }

    componentWillUnmount(): void {
        if (this.props.contract && this.props.queued_event) {
            this.props.removeInstance(this.props.queued_event.type.name, this.props.queued_event.address);
        }
    }

    render(): React.ReactNode {

        const loading = !this.props.queued_event || !this.props.minters || !this.props.marketers || !this.props.approvers || !this.props.coinbase || !this.props.address || !this.props.contract;

        if (loading) {
            return <FullPageLoader/>;
        } else {
            if (this.state.preview) {
                return <div style={{width: '100%', height: '100%'}}>
                    <QueuedEventWarning
                        edit={this.edit_mode_on}
                        start={this.start_sale}
                    />
                    <QueuedEventImages
                        queued_event={this.props.queued_event}
                        strapi_url={this.props.strapi_url}
                    />
                    <QueuedEventInformationGrid queued_event={this.props.queued_event}/>
                    <QueuedEventTicketsGrid
                        queued_event={this.props.queued_event}
                        contract={this.props.contract}
                        minters={this.props.minters}
                        marketers={this.props.marketers}
                        approvers={this.props.approvers}
                        strapi_url={this.props.strapi_url}
                    />

                </div>;
            } else {
                return <div style={{width: '100%', height: '100%', marginTop: -24, marginBottom: -24, paddingTop: 24, paddingBottom: 24}}>
                    <div style={{width: '100%', backgroundColor: theme.white, padding: 24, borderRadius: 5}}>
                        <QueuedEventEditCancel cancel={this.edit_mode_off}/>
                        <Divider/>
                        <QueuedEventEditInformations event={this.props.queued_event} cancel={this.edit_mode_off}/>
                    </div>
                </div>;
            }
        }
    }
}

const mapStateToProps = (state: AppState, ownProps: QueuedEventViewProps): QueuedEventViewRState =>
    ({
        specs: state.contracts.specs,
        contract: ownProps.queued_event ? getContract(state, ownProps.queued_event.type.name, ownProps.queued_event.address) : undefined,
        strapi_url: state.app.config.strapi_endpoint
    });

const mapDispatchToProps = (dispatch: Dispatch): QueuedEventViewRDispatch =>
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

export default connect(mapStateToProps, mapDispatchToProps)(QueuedEventView);
