import * as React                               from 'react';
import { Button, Modal }                        from 'antd';
import { I18N, I18NProps }                      from '@utils/misc/i18n';
import { EventCreationTabBaseProps }            from './EventCreationData';
import { EventCreationSummaryProps }            from './EventCreationSummaryModalPages/EventCreationSummary';
import dynamic                                  from 'next/dynamic';
import { EventCreationDeployProps }             from './EventCreationSummaryModalPages/EventCreationDeploy';
import { EventDeployProcess, EventDeployProps } from './EventCreationSummaryModalPages/EventDeployProps';
import { EventCreationExplicationsProps }       from './EventCreationSummaryModalPages/EventCreationExplications';
import { theme }                                from '../../../utils/theme';

// Dynamic Components

const EventCreationSummary: React.ComponentType<EventCreationSummaryProps> = dynamic<EventCreationSummaryProps>(async () => import('./EventCreationSummaryModalPages/EventCreationSummary'), {
    ssr: false,
    loading: (): React.ReactNode => null
});

const EventCreationExplications: React.ComponentType<EventCreationExplicationsProps> = dynamic<EventCreationExplicationsProps>(async () => import('./EventCreationSummaryModalPages/EventCreationExplications'), {
    ssr: false,
    loading: (): React.ReactNode => null
});

const EventCreationDeploy: React.ComponentType<EventCreationDeployProps> = dynamic<EventCreationDeployProps>(async () => import('./EventCreationSummaryModalPages/EventCreationDeploy'), {
    ssr: false,
    loading: (): React.ReactNode => null
});

// Props

interface EventCreationSummaryModalOwnProps {
    open: boolean;
    close: () => void;
}

export type EventCreationSummaryModalProps = EventCreationSummaryModalOwnProps & EventCreationTabBaseProps;

type MergedEventCreationSummaryModalProps = EventCreationSummaryModalProps & I18NProps;

interface EventCreationSummaryModalState {
    step: number;
    loading: boolean;
    edp: EventDeployProcess;
}

const steps = [
    {
        title: 'summary_title',
        next: (state: EventCreationSummaryModalState): boolean => true,
        content: EventCreationSummary
    },
    {
        title: 'explications_title',
        next: (state: EventCreationSummaryModalState): boolean => state.edp.explications_read,
        content: EventCreationExplications
    },
    {
        title: 'transaction_title',
        next: (state: EventCreationSummaryModalState): boolean => state.edp.deployed,
        content: EventCreationDeploy
    }
];

class EventCreationSummaryModal extends React.Component<MergedEventCreationSummaryModalProps, EventCreationSummaryModalState> {

    state: EventCreationSummaryModalState = {
        step: 0,
        loading: false,
        edp: {
            explications_read: false,
            deployed: false
        }
    };

    onClose = (): void => {
        this.props.close();
        this.setState({
            step: 0,
            loading: false,
            edp: {
                explications_read: false,
                deployed: false
            }
        });
    }

    onNext = (): void => {
        if (steps[this.state.step].next(this.state)) {
            if (this.state.step < steps.length - 1) {
                this.setState({
                    step: this.state.step + 1
                });
            } else {
                this.onClose();
            }
        }
    }

    set = (edp: Partial<EventDeployProcess>): void => {

        this.setState({
            edp: (edp as EventDeployProcess)
        });

    }

    render(): React.ReactNode {

        const Content = steps[this.state.step].content as React.ComponentType<EventDeployProps>;

        return <div>
            <style>
        {`
        
            .event_creation .ant-modal-header {
                background-color: ${theme.dark0};
            }
            
            .event_creation .ant-modal-title {
                color: ${theme.white};
            }
            
            .event_creation .ant-modal-close {
                color: ${theme.white};
            }
            
        `}
            </style>
            <Modal
                wrapClassName={'event_creation'}
                width='50%'
                title={this.props.t(steps[this.state.step].title)}
                visible={this.props.open}
                onOk={this.onNext}
                onCancel={this.props.close}
                footer={[
                    <Button key='back' onClick={this.onClose}>Cancel</Button>,
                    <Button key='submit' type='primary' loading={this.state.loading} onClick={this.onNext} disabled={!steps[this.state.step].next(this.state)}>
                        {this.state.step < steps.length - 1 ? this.props.t('button_next') : this.props.t('button_done')}
                    </Button>
                ]}
            >
                <Content
                    form_data={this.props.form_data}
                    minters={this.props.minters}
                    approvers={this.props.approvers}
                    marketers={this.props.marketers}
                    event_contracts={this.props.event_contracts}
                    t={this.props.t}
                    process={this.state.edp}
                    set={this.set}
                />
            </Modal>
        </div>;
    }
}

export default I18N.withNamespaces(['event_creation'])(EventCreationSummaryModal) as React.ComponentType<EventCreationSummaryModalProps>;
