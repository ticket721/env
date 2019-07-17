import { StrapiAddress }                 from '@utils/strapi/address';
import * as React                        from 'react';
import StrapiCall                        from '@components/strapi';
import { StrapiHelper }                  from '../../utils/StrapiHelper';
import { StrapiCacheCallReturnFragment } from '../../utils/redux/app_state';
import { StrapiTicket }                  from '../../utils/strapi/ticket';
import SaleList                          from './SaleList';
import { I18N, I18NProps }               from '../../utils/misc/i18n';
import { StrapiEvent }                   from '../../utils/strapi/event';

export interface SaleListFetcherProps {
    page_size: number;
    page_idx: number;
    set_page: (page: number) => void;
    coinbase: StrapiAddress;
    events: Partial<StrapiEvent>[];
}

type MergedSaleListFetcherProps = SaleListFetcherProps & I18NProps;

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

interface SaleListFetcherState {
    sort: string;
}

class SaleListFetcher extends React.Component<MergedSaleListFetcherProps, SaleListFetcherState> {

    state: SaleListFetcherState = {
        sort: 'event:ASC'
    };

    tickets_count_output_converter = (url: string, raw: any): StrapiCacheCallReturnFragment[] =>
        [{
            hash: StrapiHelper.request_signature('tickets', url, {}),
            data: {
                data: raw
            }
        }]

    get_tickets_count_url = (): string => {
        let url = `/tickets/count?sale.status_eq=open`;

        for (const event of this.props.events) {
            if (event.id !== undefined) {
                url += `&event=${event.id}`;
            } else if (event.address) {
                url += `&event.address.address_eq=${event.address}`;
            }
        }

        return url;
    }

    tickets_output_converter = (url: string, raw: any[]): StrapiCacheCallReturnFragment[] => {
        const ret: StrapiCacheCallReturnFragment[] = [];

        for (const elem of raw) {
            ret.push({
                hash: StrapiHelper.fragment_signature('tickets', elem.id),
                data: {
                    data: elem
                }
            });
        }
        return ret;
    }

    get_tickets_url = (): string => {

        let url = `/tickets?sale.status_eq=open&_limit=${this.props.page_size}&_start=${this.props.page_idx * this.props.page_size}`;

        for (const event of this.props.events) {
            if (event.id !== undefined) {
                url += `&event.id_eq=${event.id}`;
            } else if (event.address) {
                url += `&event.address.address_eq=${event.address}`;
            }
        }

        return url;

    }

    render(): React.ReactNode {

        const url = this.get_tickets_url();
        const count_url = this.get_tickets_count_url();

        return <StrapiCall
            calls={{
                tickets: StrapiHelper.request('get', url, {}, this.tickets_output_converter.bind(this, url)),
                count: StrapiHelper.request('get', count_url, {}, this.tickets_count_output_converter.bind(this, count_url))
            }}
        >
            {
                ({tickets, count}: {tickets: any[]; count: any[]}): React.ReactNode => {

                    tickets = filter_strapi(tickets) as StrapiTicket[];
                    count = filter_strapi(count) as number[];

                    return <SaleList coinbase={this.props.coinbase} tickets={tickets} count={count !== undefined ? (count.length ? count[0] : 0) : undefined} set_page={this.props.set_page} page_size={this.props.page_size}/>;
                }
            }
        </StrapiCall>;
    }
}

export default I18N.withNamespaces(['marketplace'])(SaleListFetcher) as React.ComponentType<SaleListFetcherProps>;
