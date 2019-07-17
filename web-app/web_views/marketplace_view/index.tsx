import { StrapiAddress }               from '@utils/strapi/address';
import * as React                      from 'react';
import { I18N, I18NProps }             from '../../utils/misc/i18n';
import { Layout }                      from 'antd';
import MarketplaceSider                from './MarketplaceSider';
import MarketplaceContent              from './MarketplaceContent';
import { withRouter, WithRouterProps } from 'next/router';
import { StrapiEvent }                 from '../../utils/strapi/event';
import { FullPageLoader }              from '../../web_components/loaders/FullPageLoader';
import { RGA }                         from '../../utils/misc/ga';

export interface MarketplaceViewProps {
    coinbase: StrapiAddress;
}

type MergedMarketplaceViewProps = MarketplaceViewProps & I18NProps & WithRouterProps;

interface MarketplaceViewState {
    page_size: number;
    page_idx: number;
    events: Partial<StrapiEvent>[];
    query_rm: boolean;
}

class MarketplaceView extends React.Component<MergedMarketplaceViewProps, MarketplaceViewState> {

    state: MarketplaceViewState = {
        page_idx: 0,
        page_size: 6,
        events: [],
        query_rm: false
    };

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + window.location.search);
    }

    set_page = (page: number): void => {
        console.log(page);
        this.setState({
            page_idx: page - 1
        });
    }

    add_event = (address: string): void => {
        this.setState({
            events: [
                ...this.state.events,
                {
                    address
                }
            ],
            page_idx: 0
        });
    }

    shouldComponentUpdate(nextProps: Readonly<MarketplaceViewProps & I18NProps & WithRouterProps>, nextState: Readonly<MarketplaceViewState>, nextContext: any): boolean {

        if (this.props.router.query.event && nextProps.router.query.event && this.props.router.query.event !== nextProps.router.query.event) {
            this.setState({
                query_rm: false
            });
        }

        return true;
    }

    rm_event = (idx: number): void => {

        const present = this.props.router.query.event && !this.state.query_rm
            && this.state.events.findIndex((event: Partial<StrapiEvent>) => event.address === this.props.router.query.event) === -1;

        if (idx === 0 && present) {
            return this.setState({
                query_rm: true
            });
        }

        if (present) --idx;

        const events = this.state.events.slice(0);

        if (events[idx].address.address === this.props.router.query.event) {
            this.setState({
                query_rm: true
            });
        }

        events.splice(idx, 1);

        this.setState({
            events,
            page_idx: 0
        });

    }

    render(): React.ReactNode {

        let events = [];

        if (this.props.router.query.event && !this.state.query_rm && this.state.events.findIndex((event: Partial<StrapiEvent>) => event.address === this.props.router.query.event) === -1) {
            events.push({
                address: this.props.router.query.event
            });
        }

        events = events.concat(this.state.events);

        if (this.props.coinbase === undefined) {
            return <FullPageLoader message={this.props.t('marketplace_loading')}/>;
        }

        return <Layout style={{width: '100%', height: '100%'}}>
            <MarketplaceSider
                coinbase={this.props.coinbase}
                events={events}
                add_event={this.add_event}
                rm_event={this.rm_event}
            />
            <MarketplaceContent
                page_size={this.state.page_size}
                page_idx={this.state.page_idx}
                set_page={this.set_page}
                coinbase={this.props.coinbase}
                events={events}
            />
        </Layout>;

    }
}

export default I18N.withNamespaces(['marketplace'])(
    withRouter(
        MarketplaceView
    )
);
