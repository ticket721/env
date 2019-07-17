import * as React                                 from 'react';
import dynamic                                    from 'next/dynamic';
import { Box, Grid }                              from 'grommet';
import { Typography }                             from 'antd';
import { I18N, I18NProps }                        from '@utils/misc/i18n';
import { VtxContract }                            from 'ethvtx/lib/contracts/VtxContract';
import { StrapiMinter }                           from '@utils/strapi/minter';
import { MinterCategoriesGetter, TicketCategory } from '@web_contract_plugins/minter/MinterCategoriesGetter';
import { AppState }                               from '@utils/redux/app_state';
import { connect }                  from 'react-redux';
import { TicketCategoryStatsProps } from '@web_components/event/display/TicketCategoryStats';
import { TicketCharacsProps }       from '@web_components/event/display/TicketCharacs';
import { StrapiMarketer }      from '@utils/strapi/marketer';
import { StrapiApprover }      from '@utils/strapi/approver';
import { PriceDisplayerProps } from '@web_components/event/display/PriceDisplayer';
import { TicketPreviewProps }  from '@web_components/event/display/TicketPreview';
import { StrapiEvent }         from '@utils/strapi/event';
import { StrapiAddress }       from '@utils/strapi/address';
import { EventBuyModalProps }  from './EventBuyModal';
import { theme }               from '../../utils/theme';

// Dyanmic Components

const TicketCategoryStats: React.ComponentType<TicketCategoryStatsProps> = dynamic<TicketCategoryStatsProps>(async () => import('@web_components/event/display/TicketCategoryStats'), {
    loading: (): React.ReactNode => null
});

const TicketCharacs: React.ComponentType<TicketCharacsProps> = dynamic<TicketCharacsProps>(async () => import('@web_components/event/display/TicketCharacs'), {
    loading: (): React.ReactNode => null
});

const PriceDisplayer: React.ComponentType<PriceDisplayerProps> = dynamic<PriceDisplayerProps>(async () => import('@web_components/event/display/PriceDisplayer'), {
    loading: (): React.ReactNode => null
});

const TicketPreview: React.ComponentType<TicketPreviewProps> = dynamic<TicketPreviewProps>(async () => import('@web_components/event/display/TicketPreview'), {
    loading: (): React.ReactNode => null
});

const EventBuyModal: React.ComponentType<EventBuyModalProps> = dynamic<EventBuyModalProps>(async () => import('./EventBuyModal'), {
    loading: (): React.ReactNode => null
});

// Props

export interface EventTicketsGridProps {
    address: StrapiAddress;
    minter: StrapiMinter;
    marketer: StrapiMarketer;
    approver: StrapiApprover;
    event: StrapiEvent;
    contract: VtxContract;
    strapi_url: string;
}

interface EventTicketsGridRState {
    categories: TicketCategory[];
    coinbase: string;
}

type MergedEventTicketsGridProps = EventTicketsGridProps & EventTicketsGridRState & I18NProps;

interface EventTicketsGridState {
    selection: number;
    buy_modal_visible: boolean;
    price_selection: string;
}

class QueuedEventTicketsGrid extends React.Component<MergedEventTicketsGridProps, EventTicketsGridState> {

    state: EventTicketsGridState = {
        selection: 0,
        buy_modal_visible: false,
        price_selection: 'ether'
    };

    set_visibility = (visible: boolean): void => {
        this.setState({
            buy_modal_visible: visible
        });
    }

    set_selection = (idx: number): void => {
        this.setState({
            selection: idx
        });
    }

    set_price_selection = (curr: string): void => {
        this.setState({
            price_selection: curr
        });
    }

    render(): React.ReactNode {
        let extra_title = null;
        if (this.props.categories && this.props.categories.length > 0) {
            extra_title = this.props.categories[this.state.selection].name;
        }

        return <div>
            <br/>
            <Typography.Text
                style={{fontSize: 42, color: theme.primary}}
            >
                {this.props.t('ticket_informations_title')}{extra_title !== null ? ` | ${extra_title}` : undefined}
            </Typography.Text>
            <EventBuyModal
                buy_modal_visible={this.state.buy_modal_visible}
                set_visibility_false={this.set_visibility.bind(this, false)}
                categories={this.props.categories}
                selection={this.state.selection}
                price_selection={this.state.price_selection}
                strapi_url={this.props.strapi_url}
                address={this.props.address}
                event={this.props.event}
                minter={this.props.minter}
                coinbase={this.props.coinbase}
                contract={this.props.contract}
                t={this.props.t}
            />
            <Grid
                style={{marginTop: 24}}
                fill={'horizontal'}
                rows={['auto', 'auto']}
                columns={['1/2', '1/4', '1/4']}
                gap='small'
                areas={[
                    {name: 'stats', start: [0, 0], end: [0, 0]},
                    {name: 'characs', start: [0, 1], end: [0, 1]},
                    {name: 'price', start: [1, 0], end: [2, 0]},
                    {name: 'ticket', start: [1, 1], end: [2, 1]}
                ]}
            >
                <Box alignContent='center' alignSelf='center' align='center' gridArea='stats' fill={true}>
                    <TicketCategoryStats
                        categories={this.props.categories}
                        selection={this.state.selection}
                        set_selection={this.set_selection}
                        creation={this.props.event.creation}
                        t={this.props.t}
                    />
                </Box>
                <Box alignContent='center' alignSelf='center' align='center' gridArea='characs' fill={true}>
                    <TicketCharacs
                        event={this.props.event}
                        marketer={this.props.marketer}
                        approver={this.props.approver}
                        t={this.props.t}
                    />
                </Box>
                <Box alignContent='center' alignSelf='center' align='center' gridArea='price' fill={true}>
                    <PriceDisplayer
                        price={this.props.categories && this.props.categories.length > 0 ? this.props.categories[this.state.selection].price : undefined}
                        selection={this.state.price_selection}
                        set_selection={this.set_price_selection}
                        t={this.props.t}
                    />
                </Box>
                <Box style={{alignItems: 'center', justifyContent: 'center'}} gridArea='ticket' fill={true}>
                    <TicketPreview
                        image={this.props.event.image}
                        event_address={this.props.address.address}
                        name={this.props.event.name}
                        strapi_url={this.props.strapi_url}
                        on_click={this.set_visibility.bind(this, true)}
                        infos={this.props.categories && this.props.categories.length > 0 ? [this.props.categories[this.state.selection].name] : []}
                        event_begin={this.props.event.start}
                    />
                </Box>
            </Grid>
        </div>;
    }
}

const mapStateToProps = (state: AppState, ownProps: EventTicketsGridProps): EventTicketsGridRState => {

    let categories = null;

    if (ownProps.minter && ownProps.contract) {

        const minter_name = ownProps.minter.name;

        categories = MinterCategoriesGetter(minter_name, ownProps.contract);

    }

    return {
        categories,
        coinbase: state.vtxconfig.coinbase
    };
};

export default I18N.withNamespaces(['events'])(
    connect(mapStateToProps)(
        QueuedEventTicketsGrid
    )
) as React.ComponentType<EventTicketsGridProps>;
