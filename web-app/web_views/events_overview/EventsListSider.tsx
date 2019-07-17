import { StrapiAddress }     from '@utils/strapi/address';
import * as React            from 'react';
import {
    Layout, Menu, Icon, Skeleton
}                            from 'antd';
import { theme }             from '../../utils/theme';
import { StrapiQueuedEvent } from '../../utils/strapi/queuedevent';
import { StrapiEvent }       from '../../utils/strapi/event';
import { I18N, I18NProps }   from '../../utils/misc/i18n';

const {
    Sider,
}: any = Layout;

// Props

export interface EventsListSiderProps {
    coinbase: StrapiAddress;
    selection: string;
    updateSelection: (key: string) => void;
}

type MergedEventsListSiderProps = EventsListSiderProps & I18NProps;

interface EventsListSiderState {
    total: number;
    total_qe: number;
    first: string;
    first_qe: string;
}

class EventsListSider extends React.Component<MergedEventsListSiderProps, EventsListSiderState> {

    state: EventsListSiderState = {
        total: null,
        total_qe: null,
        first: null,
        first_qe: null
    };

    onSelect = ({key}: any): void => {
        this.props.updateSelection(key);
    }

    shouldComponentUpdate(nextProps: Readonly<EventsListSiderProps>, nextState: Readonly<EventsListSiderState>, nextContext: any): boolean {

        if (nextProps.coinbase) {
            const sorted_queuedevents = nextProps.coinbase.queuedevents.sort((l: StrapiQueuedEvent, r: StrapiQueuedEvent): number =>
                new Date((r as any).updated_at).getTime() - new Date((l as any).updated_at).getTime());
            const sorted_events = nextProps.coinbase.events.sort((l: StrapiEvent, r: StrapiEvent): number =>
                new Date((r as any).updated_at).getTime() - new Date((l as any).updated_at).getTime());

            const first = nextProps.coinbase.events.length ? sorted_events[0].id : null;
            const first_qe = nextProps.coinbase.queuedevents.length ? sorted_queuedevents[0].id : null;

            if (this.props.coinbase === undefined || this.state.total === null) {

                this.setState({
                    total: nextProps.coinbase.events.length,
                    total_qe: nextProps.coinbase.queuedevents.length,
                    first,
                    first_qe
                });

                return false;
            }

            if (nextState.total !== null) {
                if (nextState.total !== nextProps.coinbase.events.length && nextProps.selection) {
                    this.setState({
                        total: nextProps.coinbase.events.length,
                    });
                    nextProps.updateSelection(nextProps.coinbase.queuedevents.length.toString());
                    return false;
                }
            }

            if (first !== nextState.first && nextProps.selection) {
                this.setState({
                    first
                });
                nextProps.updateSelection(nextProps.coinbase.queuedevents.length.toString());
                return false;
            }

            if (nextState.total_qe !== null) {
                if (nextState.total_qe !== nextProps.coinbase.queuedevents.length && nextProps.selection) {
                    this.setState({
                        total_qe: nextProps.coinbase.queuedevents.length,
                    });
                    nextProps.updateSelection('0');
                    return false;
                }
            }

            if (first_qe !== nextState.first_qe && nextProps.selection) {
                this.setState({
                    first_qe
                });
                nextProps.updateSelection('0');
                return false;
            }
        }

        return true;
    }

    render(): React.ReactNode {

        if (this.props.coinbase === undefined) {
            return <Sider width={280} style={{ background: theme.white, height: '100%', overflow: 'auto'}}>
                <style>{`
                    .ant-menu-inline {
                        border-right: none;
                    }
                `}</style>
                <Menu
                    mode='inline'
                    style={{ height: '100%' }}
                >
                    <Menu.Item key='loading_0' disabled={true}>
                        <Skeleton active={true} paragraph={{width: [350]}}/>
                    </Menu.Item>
                    <Menu.Item key='loading_1' disabled={true}>
                        <Skeleton active={true} paragraph={{width: [300]}}/>
                    </Menu.Item>
                    <Menu.Item key='loading_2' disabled={true}>
                        <Skeleton active={true} paragraph={{width: [400]}}/>
                    </Menu.Item>
                </Menu>
            </Sider>;

        }

        const create_event = <Menu.Item key='create' style={{backgroundColor: theme.dark2, color: theme.white, marginTop: 24, border: 'none'}}>
            <Icon type='plus' />
            <span>{this.props.t('create_event')}</span>
        </Menu.Item>;

        const events = [];
        const sorted_queuedevents = this.props.coinbase ? this.props.coinbase.queuedevents.sort((l: StrapiQueuedEvent, r: StrapiQueuedEvent): number =>
            new Date((r as any).updated_at).getTime() - new Date((l as any).updated_at).getTime()) : [];
        const sorted_events = this.props.coinbase ? this.props.coinbase.events.sort((l: StrapiEvent, r: StrapiEvent): number =>
            new Date((r as any).updated_at).getTime() - new Date((l as any).updated_at).getTime()) : [];

        events.push(create_event);

        if (this.props.coinbase) {
            let idx = 0;
            for (const event of sorted_queuedevents) {
                events.push(<Menu.Item key={idx} style={{marginTop: idx === 0 ? 24 : 0, backgroundColor: theme.queuedevent}}>
                    <Icon style={{color: theme.dark2}} type='form'/>
                    <span style={{color: theme.dark2}}>{event.name}</span>
                </Menu.Item>);
                ++idx;
            }
            for (const event of sorted_events) {
                events.push(<Menu.Item key={idx} style={{marginTop: idx === 0 ? 24 : 0, backgroundColor: theme.white}}>
                    <Icon style={{color: theme.dark2}} type='right'/>
                    <span style={{color: theme.dark2}}>{event.name}</span>
                </Menu.Item>);
                ++idx;
            }
        }

        return <Sider width={280} style={{ background: theme.white, height: '100%', overflow: 'auto'}}>
            <style>{`
                    .ant-menu-inline {
                        border-right: none;
                    }
                `}</style>
            <Menu
                mode='inline'
                selectedKeys={this.props.selection ? [this.props.selection] : undefined}
                onSelect={this.onSelect}
                style={{height: '100%'}}
            >
                {events}
            </Menu>
        </Sider>;
    }

}

export default I18N.withNamespaces(['events'])(EventsListSider);
