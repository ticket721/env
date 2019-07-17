import { StrapiAddress }               from '@utils/strapi/address';
import * as React                      from 'react';
import { Layout, Skeleton }            from 'antd';
import dynamic                         from 'next/dynamic';
import { EventCreationFormProps }      from './EventCreationForm';
import { QueuedEventViewWrapperProps } from './QueuedEventView';
import { EventViewProps }              from '../event_view';
import StrapiCall                      from '@components/strapi';
import { StrapiHelper }                from '@utils/StrapiHelper';
import { FullPageLoader }              from '@web_components/loaders/FullPageLoader';
import { EventManagement }             from '../message/event_management';
import { FetchError }                  from '../message/fetch_error';
import { theme }                       from '../../utils/theme';

const {Content}: any = Layout;

// Dynamic Components

const EventCreationForm: React.ComponentType<EventCreationFormProps> = dynamic<EventCreationFormProps>(async () => import('./EventCreationForm'), {
    loading: (): React.ReactElement => null
});

const QueuedEventView: React.ComponentType<QueuedEventViewWrapperProps> = dynamic<QueuedEventViewWrapperProps>(async () => import('./QueuedEventView'), {
    loading: (): React.ReactNode => null
});

const EventView: React.ComponentType<EventViewProps> = dynamic<EventViewProps>(async () => import('../event_view'), {
    loading: (): React.ReactNode => null
});

// Props

export interface EventsContentDisplayerProps {
    coinbase: StrapiAddress;
    selection: number | string;
}

export default class EventsContentDisplayer extends React.Component<EventsContentDisplayerProps> {
    render(): React.ReactNode {

        if (this.props.coinbase === undefined) {
            return <Content style={{marginLeft: 24, background: theme.white, padding: 24, minHeight: 280}}>
                <Skeleton active={true}/>
            </Content>;
        }

        if (this.props.selection === 'create') {
            return <Content style={{marginLeft: 24, background: theme.white, padding: 24, minHeight: 280}}>
                <EventCreationForm/>
            </Content>;
        }

        if (this.props.coinbase === null) {
            return <div/>;
        }

        if (this.props.selection < this.props.coinbase.queuedevents.length) {
            return <Content style={{marginLeft: 24, padding: 24, minHeight: 280}}>
                <QueuedEventView
                    address={this.props.coinbase.queuedevents[this.props.selection].address}
                    coinbase={this.props.coinbase}
                />
            </Content>;
        }

        const real_selection = (this.props.selection as number) - this.props.coinbase.queuedevents.length;

        if (this.props.coinbase.events.length > 0 && real_selection < this.props.coinbase.events.length) {

            return <StrapiCall
                calls={{
                    address: StrapiHelper.getEntry('addresses', this.props.coinbase.events[real_selection].address)
                }}
            >
                {({address}: { address: any[] }): React.ReactNode => {
                    if (address && address.length) {
                        if (address[0].data) {
                            return <Content style={{marginLeft: 24, padding: 24, minHeight: 280}}>
                                <EventView address={address[0].data.address} coinbase={this.props.coinbase}/>
                            </Content>;
                        } else {
                            return <Content style={{marginLeft: 24, padding: 24, minHeight: 280}}>
                                <FetchError/>
                            </Content>;
                        }
                    } else {
                        return <Content style={{marginLeft: 24, padding: 24, minHeight: 280}}>
                            <FullPageLoader/>
                        </Content>;
                    }
                }}
            </StrapiCall>;
        }

        return <EventManagement/>;

    }

}
