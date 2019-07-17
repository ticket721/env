import { StrapiAddress }  from '@utils/strapi/address';
import * as React         from 'react';
import { FilterOptions }  from './FilterForm';
import { StrapiHelper }   from '@utils/StrapiHelper';
import { StrapiTicket }   from '@utils/strapi/ticket';
import StrapiCall         from '@components/strapi';
import TicketList         from './TicketList';
import { FullPageLoader } from '@web_components/loaders/FullPageLoader';
import { NoTickets }      from '../message/no_tickets';

// Props

export interface TicketListFetcherProps {
    address: StrapiAddress;
    coinbase: string;
}

export interface TicketListFetcherState {
    entry: number;
    sort: string;
    page_size: number;
    ticket_filter_options: FilterOptions;
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

export default class TicketListFetcher extends React.Component<TicketListFetcherProps, TicketListFetcherState> {

    state: TicketListFetcherState = {
        entry: 0,
        sort: 'ticket_id:DESC',
        ticket_filter_options: {
            event: null
        },
        page_size: 6
    };

    set_filter_value = (field: string, value: any): void => {
        this.setState({
            ticket_filter_options: {
                ...this.state.ticket_filter_options,
                [field]: value
            },
            entry: 0
        });
    }

    set_entry_start = (entry: number): void => {
        this.setState({
            entry
        });
    }

    set_page_size = (page_size: number): void => {
        this.setState({
            page_size,
            entry: 0
        });
    }

    get_axios_count_path = (arg: any): any => {
        let ret = `/tickets/count?owner=${arg.id}`;

        if (this.state.ticket_filter_options.event) {
            let event_filter = '';
            for (const event_id of this.state.ticket_filter_options.event) {
                event_filter += `&event_in=${event_id}`;
            }

            ret += event_filter;
        }

        return ret;
    }

    get_axios_path = (arg: any): any => {
        let ret = `/tickets?owner=${arg.id}&_limit=${this.state.page_size}&_start=${this.state.entry}&_sort=${this.state.sort}`;

        if (this.state.ticket_filter_options.event) {
            let event_filter = '';
            for (const event_id of this.state.ticket_filter_options.event) {
                event_filter += `&event_in=${event_id}`;
            }

            ret += event_filter;
        }

        return ret;
    }

    ticket_output_converter = (ret: any): any =>
        ret.map((ticket: StrapiTicket): any =>
            ({
                hash: StrapiHelper.fragment_signature('tickets', ticket.id.toString()),
                data: {
                    data: ticket
                }
            }))

    count_output_converter = (call: string, ret: any): any => {
        if (ret !== undefined && ret !== null) {
            return [
                {
                    hash: StrapiHelper.fragment_signature('count', call),
                    data: {
                        data: ret
                    }
                }
            ];
        } else {
            return [];
        }
    }

    events_output_converter = (addr_id: string, ret: any): any =>
        ret.map((events: any): any =>
            ({
                hash: StrapiHelper.fragment_signature('eventsofaddress', addr_id),
                data: {
                    data: events
                }
            }))

    render(): React.ReactNode {

        if (this.props.address === undefined) {
            return <div style={{margin: 100}}>
                <NoTickets/>
            </div>;
        }

        const count_url = this.get_axios_count_path(this.props.address);
        const ticket_url = this.get_axios_path(this.props.address);

        return <StrapiCall
            calls={{
                address: StrapiHelper.getEntries('addresses', {address: this.props.address.address}),
                count: StrapiHelper.request('get', count_url, {}, this.count_output_converter.bind(this, count_url)),
                tickets: StrapiHelper.request('get', ticket_url, {}, this.ticket_output_converter),
                events: StrapiHelper.request('get', '/addresses/eventsoftickets', {
                    params: {
                        address: this.props.address.address
                    }
                }, this.events_output_converter.bind(this, this.props.address.address))
            }}
        >
            {({tickets, count, events}: any): React.ReactNode => {

                count = filter_strapi(count);
                tickets = filter_strapi(tickets);
                events = filter_strapi(events);

                if (events) {
                    return <TicketList
                        address={this.props.address}
                        coinbase={this.props.coinbase}
                        tickets={tickets || null}
                        ticket_count={count !== undefined ? count[0] : 0}
                        filter_setter={this.set_filter_value}
                        entry_setter={this.set_entry_start}
                        page_size_setter={this.set_page_size}
                        options={this.state.ticket_filter_options}
                        linked_events={events ? events[0].events : null}
                        page_size={this.state.page_size}
                    />;
                } else {
                    return <div style={{width: '100%', height: '100%', marginBottom: '10%'}}>
                        <FullPageLoader message={'tickets_loading'}/>
                    </div>;
                }
            }}
        </StrapiCall>;

    }
}
