import * as React                         from 'react';
import { Steps, Button }                  from 'antd';
import dynamic                            from 'next/dynamic';
import { EventCreationInformationsProps } from './EventCreationInformations';
import { EventCreationData }              from './EventCreationData';
import { MinterSelectionFormProps }       from '@web_contract_plugins/minter/MinterSelectionForm';
import { StrapiMinter }                   from '@utils/strapi/minter';
import { StrapiApprover }                 from '@utils/strapi/approver';
import { StrapiMarketer }                 from '@utils/strapi/marketer';
import { StrapiEventContract }            from '@utils/strapi/eventcontract';
import { MarketerSelectionFormProps }     from '../../../web_contract_plugins/marketer/MarketerSelectionForm';
import { ApproverSelectionFormProps }     from '@web_contract_plugins/approver/ApproverSelectionForm';
import EventCreationSummaryModal          from './EventCreationSummaryModal';
import { ContractsSpecStore }             from 'ethvtx/lib/state/contracts';
import { AppState }                       from '@utils/redux/app_state';
import { connect }                        from 'react-redux';
import { Dispatch }                       from 'redux';
import { loadContractSpec }               from 'ethvtx/lib/contracts/helpers/dispatchers';
import { I18N, I18NProps }            from '@utils/misc/i18n';

const Step = Steps.Step;

// Dynamic Components

const EventCreationInformations: React.ComponentType<EventCreationInformationsProps> = dynamic<EventCreationInformationsProps>(async () => import('./EventCreationInformations'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const MinterSelectionForm: React.ComponentType<MinterSelectionFormProps> = dynamic<MinterSelectionFormProps>(async () => import('../../../web_contract_plugins/minter/MinterSelectionForm'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const MarketerSelectionForm: React.ComponentType<MarketerSelectionFormProps> = dynamic<MarketerSelectionFormProps>(async () => import('../../../web_contract_plugins/marketer/MarketerSelectionForm'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const ApproverSelectionForm: React.ComponentType<ApproverSelectionFormProps> = dynamic<ApproverSelectionFormProps>(async () => import('../../../web_contract_plugins/approver/ApproverSelectionForm'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const steps = [
    {
        title: 'informations_title',
        content: EventCreationInformations,
        ready: ['name', 'description', 'banners', 'image', 'location', 'dates']
    },
    {
        title: 'sell_strategy_title',
        content: MinterSelectionForm,
        ready: ['minter']
    },
    {
        title: 'marketplace_strategy_title',
        content: MarketerSelectionForm,
        ready: ['marketer']
    },
    {
        title: 'transfer_strategy_title',
        content: ApproverSelectionForm,
        ready: ['approver']
    }
];

// Props

export interface EventCreationTabsProps {
    minters: StrapiMinter[];
    approvers: StrapiApprover[];
    marketers: StrapiMarketer[];
    event_contracts: StrapiEventContract[];
}

interface EventCreationTabsRState {
    specs: ContractsSpecStore;
}

interface EventCreationTabsRDispatch {
    addContractSpec: (name: string, abi: any, bin: string, constructor_bin: string) => void;
}

type MergedEventCreationTabsProps = EventCreationTabsProps & EventCreationTabsRState & EventCreationTabsRDispatch & I18NProps;

export interface EventCreationTabsState {
    current: number;
    data: EventCreationData;
    summary: boolean;
}

const ready = (data: EventCreationData, rules: string[]): boolean => {
    for (const rule of rules) {
        if (data[rule] === null) return false;
    }
    return true;
};

class EventCreationTabs extends React.Component<MergedEventCreationTabsProps, EventCreationTabsState> {

    state: EventCreationTabsState = {
        current: 0,
        data: {
            minter: null,
            minter_args: {},
            approver: null,
            approver_args: {},
            marketer: null,
            marketer_args: {},
            name: null,
            description: null,
            banners: null,
            image: null,
            location: null,
            dates: null
        },
        summary: false
    };

    set_data = (field: string, value: any): void => {
        (this.setState as any)({
            data: {
                ...this.state.data,
                [field]: value
            }
        });
    }

    next = (): void => {
        const current = this.state.current + 1;
        this.setState({current});
    }

    prev = (): void => {
        const current = this.state.current - 1;
        this.setState({current});
    }

    modal_trigger = (): void => {
        this.setState({
            summary: true
        });
    }

    modal_close = (): void => {
        this.setState({
            summary: false
        });
    }

    shouldComponentUpdate(nextProps: Readonly<MergedEventCreationTabsProps>, nextState: Readonly<EventCreationTabsState>, nextContext: any): boolean {
        if (nextProps.event_contracts) {
            for (const event_contract of nextProps.event_contracts) {
                if (!nextProps.specs[event_contract.name]) {
                    nextProps.addContractSpec(event_contract.name, event_contract.abi, event_contract.runtime_binary, event_contract.binary);
                }
            }
        }

        return true;
    }

    render(): React.ReactNode {
        const {current}: any = this.state;

        const Content = steps[current].content;

        return <div style={{height: '100%'}}>
            <EventCreationSummaryModal
                open={this.state.summary}
                close={this.modal_close}
                form_data={this.state.data}
                minters={this.props.minters}
                marketers={this.props.marketers}
                approvers={this.props.approvers}
                set_data={this.set_data}
                event_contracts={this.props.event_contracts}
            />
            <style>{`
                #creation_steps .ant-steps-item-process .ant-steps-item-title {
                    font-weight: 300;
                }
            `}
            </style>
            <Steps current={current} style={{height: '10%'}} id='creation_steps'>
                {steps.map((item: any): any => <Step title={this.props.t(item.title)} key={item.title}/>)}
            </Steps>
            <div className='steps-content' style={{minHeight: '82%'}}>
                <Content
                    minters={this.props.minters}
                    marketers={this.props.marketers}
                    approvers={this.props.approvers}
                    event_contracts={this.props.event_contracts}
                    form_data={this.state.data}
                    set_data={this.set_data}
                />
            </div>

            <div className='steps-action' style={{height: '5%'}}>
                {
                    current < steps.length - 1
                        ?
                        <Button
                            type='primary'
                            style={{margin: 20}}
                            disabled={!ready(this.state.data, steps[current].ready)}
                            onClick={this.next}
                        >
                            {this.props.t('button_next')}
                        </Button>
                        :
                        null
                }
                {
                    current === steps.length - 1
                        ?
                        <Button
                            type='primary'
                            style={{margin: 20}}
                            disabled={!ready(this.state.data, steps[current].ready)}
                            onClick={this.modal_trigger}
                        >
                            {this.props.t('button_done')}
                        </Button>
                        :
                        null
                }
                {
                    current > 0
                        ?
                        (
                            <Button style={{marginLeft: 8}} onClick={this.prev}>
                                {this.props.t('button_previous')}
                            </Button>
                        )
                        :
                        null
                }
            </div>
        </div>;
    }
}

const mapStateToProps = (state: AppState, ownProps: EventCreationTabsProps): EventCreationTabsRState => ({
    ...ownProps,
    specs: state.contracts.specs
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: EventCreationTabsProps): EventCreationTabsRDispatch => ({
    ...ownProps,
    addContractSpec: (name: string, abi: any, bin: string, constructor_bin: string): void => loadContractSpec(dispatch, name, abi, {
        bin,
        constructor_bin
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(
    I18N.withNamespaces(['event_creation'])(
        EventCreationTabs
    )
) as React.ComponentType<EventCreationTabsProps>;
