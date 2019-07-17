import * as React                 from 'react';
import { I18N, I18NProps }        from '@utils/misc/i18n';
import { Icon, List, Typography } from 'antd';
import { Input }                  from 'antd';
import { SyntheticEvent }         from 'react';
import StrapiCall                 from '@components/strapi';
import { StrapiHelper }           from '@utils/StrapiHelper';
import { StrapiEvent }            from '@utils/strapi/event';
import { theme }                  from '../../../utils/theme';

export interface EventFilterProps {
    events: Partial<StrapiEvent>[];
    add_event: (addr: string) => void;
    rm_event: (idx: number) => void;
}

type MergedEventFilterProps = EventFilterProps & I18NProps;

interface EventFilterState {
    event_name: string;
    event_id: number;
    idx: number;
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

class EventFilter extends React.Component<MergedEventFilterProps, EventFilterState> {

    state: EventFilterState = {
        event_name: null,
        event_id: null,
        idx: 0
    };

    on_name_change = (e: SyntheticEvent): void => {

        const name = (e.target as any).value;

        if (!name || !name.length) {
            this.setState({
                event_name: null,
                idx: this.state.idx + 1
            });
        } else {
            this.setState({
                event_name: name,
                idx: this.state.idx + 1
            });
        }
    }

    on_id_change = (e: SyntheticEvent): void => {

        const id = (e.target as any).value;

        if (!id || !id.length) {
            this.setState({
                event_id: null,
                idx: this.state.idx + 1
            });
        } else {
            this.setState({
                event_id: parseInt(id),
                idx: this.state.idx + 1
            });
        }
    }

    add_event = (event: StrapiEvent): void => {
        this.props.add_event(event.address.address);
    }

    propositions_render_item = (item: StrapiEvent): React.ReactNode => {
        if ((item as any).loader === true) {
            return <List.Item style={{backgroundColor: theme.white, width: '100%', height: 32, padding: 0}}>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        float: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Icon type='loading' style={{fontSize: 12}} spin={true}/>
                </div>
            </List.Item>;
        }

        if ((item as any).empty === true) {
            return <List.Item style={{backgroundColor: theme.white, width: '100%', height: 32, padding: 0}}>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        float: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography.Text style={{fontSize: 12}}>{this.props.t('filter_event_no_result')}</Typography.Text>
                </div>
            </List.Item>;
        }

        let disabled = false;

        for (const event of this.props.events) {
            for (const key of Object.keys(event)) {
                switch (key) {
                    case 'address':
                        if (event.address === item.address.address) {
                            disabled = true;
                        }

                        break ;
                    case 'id':
                        if (event.id === item.id) {
                            disabled = true;
                        }

                        break ;
                }
            }
        }

        return <List.Item
            className={disabled ? 'disabled_selectable' : 'selectable'}
            onClick={disabled ? undefined : this.add_event.bind(this, item)}
            style={{
                backgroundColor: theme.white,
                width: '100%',
                height: 32,
                padding: 0,
                cursor: disabled ? undefined : 'pointer'
            }}
        >
            <div style={{width: '10%', float: 'left', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography.Text style={{fontSize: 8}}>{disabled ?  '' : '➕'}</Typography.Text>
            </div>
            <div style={{width: '60%', float: 'left', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography.Text style={{fontSize: 12, color: disabled ? theme.lightgrey : undefined}}>{item.name}</Typography.Text>
            </div>
            <div style={{width: 1, height: '100%', backgroundColor: theme.event_filter_divider, float: 'left'}}/>
            <div style={{width: '29%', float: 'left', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography.Text style={{fontSize: 12, color: disabled ? theme.lightgrey : undefined}}>{item.id}</Typography.Text>
            </div>

        </List.Item>;
    }

    propositions_generator = (events: StrapiEvent[]): React.ReactNode => {

        if (!events) {
            return <div>
                <br/>
                <List
                    size={'small'}
                    bordered={true}
                    dataSource={[{loader: true} as any]}
                    renderItem={this.propositions_render_item}
                />
            </div>;
        }

        return <div>
            <br/>
            <List
                size={'small'}
                bordered={true}
                dataSource={events.length ? events : [{empty: true} as any]}
                renderItem={this.propositions_render_item}
            />
        </div>;
    }

    rm_event = (idx: number): void => {
        this.props.rm_event(idx);
    }

    selections_render_item = (item: Partial<StrapiEvent>, idx: number): React.ReactNode => {

        const query = {};

        Object.keys(item).forEach((key: string): void => {
            switch (key) {
                case 'address':
                    query[`address.address_eq`] = item[key];
                    return;

                case 'id':
                    query[`id_eq`] = item[key];
                    return ;
            }
        });

        return <List.Item
            onClick={this.rm_event.bind(this, idx)}
            className='selectable_selection'
            style={{
                width: '100%',
                height: 32,
                padding: 0,
                cursor: 'pointer',

            }}
        >
            <StrapiCall
                calls={{
                    event: StrapiHelper.getEntries('events', query)
                }}
            >
                {({event}: {event: any[]}): React.ReactNode => {

                    event = filter_strapi(event);

                    if (!event) {
                        return <div style={{float: 'left', width: '100%', height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Icon type='loading' style={{fontSize: 12, color: 'white'}} spin={true}/>
                        </div>;
                    }

                    if (!event.length) {
                        return null;
                    }

                    const event_data = event[0];

                    return <div style={{width: '100%', height: 32}}>
                        <div style={{width: '10%', height: 32, float: 'left', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Typography.Text style={{fontSize: 8}}>❌</Typography.Text>
                        </div>
                        <div style={{width: '60%', height: 32, float: 'left', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Typography.Text style={{fontSize: 12}}>{event_data.name}</Typography.Text>
                        </div>
                        <div style={{width: 1, height: '100%', backgroundColor: theme.dark5, float: 'left'}}/>
                        <div style={{width: '29%', height: 32, float: 'left', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Typography.Text style={{fontSize: 12}}>{event_data.id}</Typography.Text>
                        </div>
                    </div>;

                }}
            </StrapiCall>

        </List.Item>;
    }

    selections_generator = (): React.ReactNode =>
        <div>
            <br/>
            <Typography.Text
                style={{color: theme.white, fontSize: 16}}
            >
                {this.props.t('filter_event_selec_desc')}
            </Typography.Text>
            <br/>
            <List
                className={'selections_list'}
                size={'small'}
                bordered={true}
                style={{
                    borderColor: theme.dark5,
                    marginTop: 12
                }}
                dataSource={this.props.events}
                renderItem={this.selections_render_item}
            />
        </div>

    render(): React.ReactNode {

        const selections = this.selections_generator();

        return <div>
            <style>{`
                .selectable .ant-typography {
                    color: ${theme.dark2};
                }
                
                .selectable:hover .ant-typography {
                    color: ${theme.primary};
                }
                
                .selectable_selection .ant-typography {
                    color: ${theme.white};
                }
                .selectable_selection:hover .ant-typography {
                    color: ${theme.danger};
                }
                .selections_list .ant-list-item {
                    border-bottom: 1px solid ${theme.dark7};
                }
            `}</style>
            <Typography.Text
                style={{color: theme.white, fontSize: 28}}
            >
                {this.props.t('filter_event_title')}
            </Typography.Text>
            <br/>
            <Typography.Text
                style={{color: theme.white, fontSize: 16}}
            >
                {this.props.t('filter_event_desc')}
            </Typography.Text>
            <StrapiCall
                calls={{
                    events: StrapiHelper.getEntries('events', {
                        name_contains: this.state.event_name !== null && this.state.event_id === null ? this.state.event_name : undefined,
                        id_eq: this.state.event_id !== null ? this.state.event_id.toString() : undefined,
                        _limit: 6
                    })
                }}
                always_refresh={true}
            >
                {
                    ({events}: { events: any[] }): React.ReactNode => {

                        events = filter_strapi(events);

                        const propositions = this.propositions_generator(events);

                        return <div>
                            <Input.Group compact={true} style={{marginTop: 12}}>
                                <Input
                                    style={{width: '70%'}}
                                    value={this.state.event_name}
                                    placeholder={this.props.t('filter_event_name')}
                                    onChange={this.on_name_change}
                                    allowClear={true}
                                />
                                <Input
                                    type='number'
                                    style={{width: '30%'}}
                                    value={this.state.event_id}
                                    placeholder={'ID'}
                                    onChange={this.on_id_change}
                                    allowClear={true}
                                />
                            </Input.Group>
                            <div>
                                {
                                    this.state.event_id !== null || this.state.event_name !== null

                                        ?
                                        propositions

                                        :
                                        null
                                }
                            </div>
                        </div>;
                    }
                }
            </StrapiCall>
            <div>
                {
                    this.props.events.length

                        ?
                        selections

                        :
                        null
                }
            </div>
        </div>;

    }
}

export default I18N.withNamespaces(['marketplace'])(EventFilter);
