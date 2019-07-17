import { StrapiAddress }      from '@utils/strapi/address';
import { StrapiTicket }       from '@utils/strapi/ticket';
import * as React             from 'react';
import { Card, Icon, List }   from 'antd';
import LoadingTicket          from '../../web_components/ticket/LoadingTicket';
import Ticket                 from '../../web_components/ticket';
import PriceWidget            from './PriceWidget';
import { NoTicketsForFilter } from '../message/no_tickets_for_filter';
import { theme }              from '../../utils/theme';
import { AppState }           from '../../utils/redux/app_state';
import { connect }            from 'react-redux';

export interface SaleListProps {
    coinbase: StrapiAddress;
    count: number;
    tickets: StrapiTicket[];
    set_page: (page: number) => void;
    page_size: number;
}

export interface SaleListRState {
    r_coinbase: string;
}

type MergedSaleListProps = SaleListProps & SaleListRState;

class SaleList extends React.Component<MergedSaleListProps> {

    render_item = (ticket: any): React.ReactNode => {
        if (ticket.loader) {
            return <List.Item style={{marginTop: 62, height: 250, width: 500 + 12 + 150}}>
                <div style={{height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <LoadingTicket/>
                    <Card style={{marginLeft: 12, height: 194, width: 150, backgroundColor: theme.dark2, borderRadius: 6, borderColor: theme.dark2, boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'}}>
                        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Icon type='loading' style={{ fontSize: 64, color: theme.dark7 }}/>
                        </div>
                    </Card>
                </div>
            </List.Item>;
        }

        return <List.Item style={{marginTop: 62, height: 250, width: 500 + 12 + 150}}>
            <div style={{height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{zIndex: 1}}>
                <Ticket ticket={ticket.data} coinbase={this.props.coinbase ? this.props.coinbase.address : this.props.r_coinbase} show_marketplace_link={false}/>
                </div>
                <style>{`
                    #info_card .ant-card-body {
                        padding: 0;
                        text-align: center;
                    }
                `}</style>
                <PriceWidget ticket={ticket.data}/>
            </div>
        </List.Item>;

    }

    gen_loaders = (count: number): any => {
        const ret = [];
        for (let idx = 0; idx < count; ++idx) {
            ret.push({
                loader: true,
                placeholder: false,
                data: null
            });
        }

        return ret;
    }

    on_page_change = (page: number): void => {
        this.props.set_page(page);
    }

    render(): React.ReactNode {

        if (this.props.count === 0) {
            return <NoTicketsForFilter/>;
        }

        const tickets = this.props.tickets
            ?
            this.props.tickets.map((ticket: StrapiTicket): any => ({loader: false, placeholder: false, data: ticket}))
            :
            this.gen_loaders(this.props.page_size);

        return <List
            grid={{
                gutter: 32, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2
            }}
            dataSource={tickets}
            renderItem={this.render_item}
            pagination={{
                pageSize: this.props.page_size,
                total: this.props.count,
                onChange: this.on_page_change
            }}
        />;
    }
}

const mapStateToProps = (state: AppState): SaleListRState => ({
    r_coinbase: state.vtxconfig.coinbase
});

export default connect(mapStateToProps)(SaleList);
