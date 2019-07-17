import StrapiCall               from '@components/strapi';
import * as React               from 'react';
import { StrapiHelper }         from '../../utils/StrapiHelper';
import { StrapiEvent }          from '../../utils/strapi/event';
import EventCardFetcher         from '../../web_components/event/card';
import { List, Typography }     from 'antd';
import { FullPageLoader }       from '../../web_components/loaders/FullPageLoader';
import { theme }                from '../../utils/theme';
import { keccak256 }            from 'ethereumjs-util';
import { HomeEventListFilters } from './HomeEventListDrawerContent';
import { I18N, I18NProps }      from '../../utils/misc/i18n';

export interface HomeEventListFetcherProps {
    name: string;
    filters: HomeEventListFilters;
}

const EVENT_PER_PAGE = 6;

type MergedHomeEventListFetcherProps = HomeEventListFetcherProps & I18NProps;

interface HomeEventListFetcherState {
    page: number;
    search_hash: string;
}

const filter_strapi = (entities: any[]): any[] => {

    // Removing Errored entities
    let real_entities;
    if (entities) {
        real_entities = [];
        for (const entity of entities) {
            if (entity.data !== undefined) {
                real_entities.push(entity.data);
            }
        }
    } else {
        real_entities = entities;
    }

    return real_entities;
};

class HomeEventListFetcher extends React.Component<MergedHomeEventListFetcherProps, HomeEventListFetcherState> {

    constructor(props: MergedHomeEventListFetcherProps) {
        super(props);

        this.state = {
            search_hash: this.get_hash(props),
            page: 0,
        };
    }

    get_hash = (props: MergedHomeEventListFetcherProps): string =>
        keccak256(`${props.name}`).toString('hex')

    shouldComponentUpdate(nextProps: Readonly<MergedHomeEventListFetcherProps>, nextState: Readonly<HomeEventListFetcherState>, nextContext: any): boolean {
        if (this.get_hash(nextProps) !== nextState.search_hash) {
            this.setState({
                search_hash: this.get_hash(nextProps),
                page: 0
            });
        }
        return true;
    }

    gen_empty_events = (count: number): any[] => {
        const ret = [];

        for (let idx = 0; idx < count; ++idx) {
            ret.push({
                key: idx,
                event: undefined
            });
        }

        return ret;
    }

    events_output_converter = (ret: any): any =>
        ret.map((event: StrapiEvent): any =>
            ({
                hash: StrapiHelper.fragment_signature('events', event.id.toString()),
                data: {
                    data: event
                }
            }))

    count_output_converter = (args: any, ret: any): any =>
        [{
            hash: StrapiHelper.getEntryCount_signature('incomingevents', args),
            data: {
                data: ret
            }
        }]

    get_events_url = (): string => {
        let ret = `/events/dashboard?sort=${this.props.filters.sort.method}&limit=${EVENT_PER_PAGE}&offset=${this.state.page * EVENT_PER_PAGE}`;

        if (this.props.name) {
            ret += `&name=${this.props.name}`;
        }

        if (this.props.filters.filter.marketplace !== null) {
            ret += `&marketplace=${this.props.filters.filter.marketplace}`;
        }

        return ret;

    }

    get_count_url = (): string => {
        let ret = `/events/dashboard_count`;

        const extensions = [];

        if (this.props.name) {
            extensions.push(`name=${this.props.name}`);
        }

        if (this.props.filters.filter.marketplace !== null) {
            extensions.push(`marketplace=${this.props.filters.filter.marketplace}`);
        }

        if (extensions.length) {
            const merged_extensions = extensions.join('&');
            ret += `?${merged_extensions}`;
        }

        return ret;
    }

    render_items = ({idx, event}: {event: StrapiEvent, idx: number}): React.ReactNode =>
        <List.Item>
            <EventCardFetcher event={event} refresh={true}/>
        </List.Item>

    on_page_change = (page: number, pageSize: number): void => {
        console.log(page);
        this.setState({
            page: page - 1
        });
    }

    render(): React.ReactNode {

        const events_url = this.get_events_url();
        const count_url = this.get_count_url();

        return <StrapiCall
            calls={{
                count: StrapiHelper.request('get', count_url, {}, this.count_output_converter.bind(this, count_url)),
                events: StrapiHelper.request('get', events_url, {}, this.events_output_converter)
            }}
        >
            {
                ({events, count}: { events: any[], count: any[] }): React.ReactNode => {
                    events = filter_strapi(events);
                    count = filter_strapi(count);
                    if (events && events.length && count && count.length) {
                        return <div style={{padding: 12}}>
                            <Typography.Text style={{color: theme.dark2, fontSize: 42, fontWeight: 100}}>{count[0]} {this.props.t('homepage_results')}</Typography.Text>
                            <List
                                style={{marginTop: 12}}
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 1,
                                    md: 1,
                                    lg: 2,
                                    xl: 2,
                                    xxl: 3
                                }}
                                dataSource={events.map((event: StrapiEvent, idx: number): any => ({idx, event}))}
                                renderItem={this.render_items}
                                pagination={{
                                    pageSize: EVENT_PER_PAGE,
                                    total: count[0],
                                    onChange: this.on_page_change
                                }}
                            />
                        </div>;
                    } else {
                        if (count && count.length) {
                            if (count[0] > 0) {
                                const empty = this.gen_empty_events(count[0]);
                                return <div style={{padding: 12}}>
                                    <Typography.Text style={{color: theme.dark2, fontSize: 42, fontWeight: 100}}>{count[0]} {this.props.t('homepage_results')}</Typography.Text>
                                    <List
                                        style={{marginTop: 12}}
                                        grid={{
                                            gutter: 16,
                                            xs: 1,
                                            sm: 1,
                                            md: 1,
                                            lg: 2,
                                            xl: 2,
                                            xxl: 3
                                        }}
                                        dataSource={empty}
                                        renderItem={this.render_items}
                                        pagination={{
                                            pageSize: EVENT_PER_PAGE,
                                            total: count[0],
                                            onChange: this.on_page_change
                                        }}
                                    />
                                </div>;
                            } else {
                                return <div style={{padding: 12}}>
                                    <Typography.Text style={{color: theme.dark2, fontSize: 42, fontWeight: 100}}>{count[0]} {this.props.t('homepage_results')}</Typography.Text>
                                </div>;
                            }
                        }
                        return <FullPageLoader/>;
                    }
                }
            }
        </StrapiCall>;
    }
}

export default I18N.withNamespaces(['home'])(HomeEventListFetcher) as React.ComponentType<HomeEventListFetcherProps>;
