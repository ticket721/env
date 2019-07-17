import * as React        from 'react';
import { Layout }        from 'antd';
import { StrapiAddress } from '@utils/strapi/address';
import SaleListFetcher   from './SaleListFetcher';
import { StrapiEvent }   from '@utils/strapi/event';

const Content = Layout.Content;

export interface MarketplaceContentProps {
    page_idx: number;
    page_size: number;
    set_page: (page: number) => void;
    coinbase: StrapiAddress;
    events: Partial<StrapiEvent>[];
}

export default class MarketplaceContent extends React.Component<MarketplaceContentProps> {
    render(): React.ReactNode {
        return <Content style={{marginLeft: 24, padding: 24, minHeight: 280}}>
            <SaleListFetcher coinbase={this.props.coinbase} events={this.props.events} page_idx={this.props.page_idx} page_size={this.props.page_size} set_page={this.props.set_page}/>
        </Content>;

    }
}
