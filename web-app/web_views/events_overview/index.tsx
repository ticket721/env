import * as React                      from 'react';
import { StrapiAddress }               from '@utils/strapi/address';
import dynamic                         from 'next/dynamic';
import {
    Layout
}                                      from 'antd';
import { EventsListSiderProps }        from './EventsListSider';
import { EventsContentDisplayerProps } from './EventsContentDisplayer';
import { routes }                      from '@utils/routing';
import { withRouter, WithRouterProps } from 'next/router';

// Dynamic Components

const EventsContentDisplayer: React.ComponentType<EventsContentDisplayerProps> = dynamic<EventsContentDisplayerProps>(async () => import('./EventsContentDisplayer'), {
    loading: (): React.ReactElement => null
});

const EventsListSider: React.ComponentType<EventsListSiderProps> = dynamic<EventsListSiderProps>(async () => import('./EventsListSider'), {
    loading: (): React.ReactElement => null
});

// Props

export interface EventsOverviewProps {
    coinbase: StrapiAddress;
}

type MergedEventsOverviewProps = EventsOverviewProps & WithRouterProps;

interface EventsOverviewState {
    selection: string;
}

class EventsOverview extends React.Component<MergedEventsOverviewProps, EventsOverviewState> {

    constructor(props: MergedEventsOverviewProps) {
        super(props);

        this.state = {
            selection: props.router.query.id as string
        };
        if (props.router.query.id) {
            routes.Router.pushRoute('events');
        }
    }

    updateSelection = (key: string): void => {
        this.setState({
            selection: key
        });
    }

    shouldComponentUpdate(nextProps: Readonly<MergedEventsOverviewProps>, nextState: Readonly<EventsOverviewState>, nextContext: any): boolean {

        if (nextProps.router.query.id && nextProps.router.query.id !== nextState.selection) {
            this.updateSelection(nextProps.router.query.id as string);
            routes.Router.pushRoute('events');
            return false;
        } else {

            try {
                const value = parseInt(nextProps.router.query.id as string);
                if (nextProps.coinbase && value > nextProps.coinbase.events.length + nextProps.coinbase.queuedevents.length) {
                    this.updateSelection('0');
                }
            } catch (e) {
                if (nextProps.router.query.id !== 'create') {
                    this.updateSelection('0');
                }
            }
        }

        return true;
    }

    render(): React.ReactNode {
        return <Layout style={{width: '100%', height: '100%'}}>
            <EventsListSider
                coinbase={this.props.coinbase}
                selection={this.state.selection}
                updateSelection={this.updateSelection}
            />
            <EventsContentDisplayer coinbase={this.props.coinbase} selection={this.state.selection}/>
        </Layout>;
    }
}

export default withRouter(EventsOverview);
