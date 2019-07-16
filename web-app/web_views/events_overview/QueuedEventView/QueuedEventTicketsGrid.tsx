import * as React                                 from 'react';
import dynamic                                    from 'next/dynamic';
import { Box, Grid }                              from 'grommet';
import { Typography }                             from 'antd';
import { I18N, I18NProps }                        from '@utils/misc/i18n';
import { StrapiQueuedEvent }                      from '@utils/strapi/queuedevent';
import { VtxContract }                            from 'ethvtx/lib/contracts/VtxContract';
import { StrapiMinter }                           from '@utils/strapi/minter';
import { MinterCategoriesGetter, TicketCategory } from '@web_contract_plugins/minter/MinterCategoriesGetter';
import { AppState }                               from '@utils/redux/app_state';
import { connect }                                from 'react-redux';
import { TicketCategoryStatsProps } from '@web_components/event/display/TicketCategoryStats';
import { TicketCharacsProps }       from '@web_components/event/display/TicketCharacs';
import { StrapiMarketer }           from '@utils/strapi/marketer';
import { StrapiApprover }           from '@utils/strapi/approver';
import { PriceDisplayerProps }      from '@web_components/event/display/PriceDisplayer';
import TicketPreview                from '@web_components/event/display/TicketPreview';
import { theme }                    from '../../../utils/theme';

// Dynamic Components

const TicketCategoryStats: React.ComponentType<TicketCategoryStatsProps> = dynamic<TicketCategoryStatsProps>(async () => import('@web_components/event/display/TicketCategoryStats'), {
    loading: (): React.ReactNode => null
});

const TicketCharacs: React.ComponentType<TicketCharacsProps> = dynamic<TicketCharacsProps>(async () => import('@web_components/event/display/TicketCharacs'), {
    loading: (): React.ReactNode => null
});

const PriceDisplayer: React.ComponentType<PriceDisplayerProps> = dynamic<PriceDisplayerProps>(async () => import('@web_components/event/display/PriceDisplayer'), {
    loading: (): React.ReactNode => null
});

// Props

export interface QueuedEventTicketsGridProps {
    minters: StrapiMinter[];
    marketers: StrapiMarketer[];
    approvers: StrapiApprover[];
    queued_event: StrapiQueuedEvent;
    contract: VtxContract;
    strapi_url: string;
}

interface QueuedEventTicketsGridRState {
    categories: TicketCategory[];
    error: string;
}

type MergedQueuedEventTicketsGridProps = QueuedEventTicketsGridProps & QueuedEventTicketsGridRState & I18NProps;

interface QueuedEventTicketsGridState {
    selection: number;
    price_selection: string;
}

class QueuedEventTicketsGrid extends React.Component<MergedQueuedEventTicketsGridProps, QueuedEventTicketsGridState> {

    state: QueuedEventTicketsGridState = {
        selection: 0,
        price_selection: 'ether'
    };

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
        if (this.props.categories.length > 0) {
            extra_title = this.props.categories[this.state.selection].name;
        }

        const marketer_idx = this.props.marketers.findIndex((marketer: StrapiMinter): boolean => marketer.id === this.props.queued_event.type.marketer);
        const approver_idx = this.props.approvers.findIndex((approver: StrapiApprover): boolean => approver.id === this.props.queued_event.type.approver);

        const marketer = marketer_idx !== -1 ? this.props.marketers[marketer_idx] : null;
        const approver = approver_idx !== -1 ? this.props.approvers[approver_idx] : null;

        return <div>
            <br/>
            <Typography.Text
                style={{fontSize: 42, color: theme.primary}}
            >
                {this.props.t('ticket_informations_title')}{extra_title !== null ? ` | ${extra_title}` : undefined}
            </Typography.Text>
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
                        creation={this.props.queued_event.creation}
                        t={this.props.t}
                    />
                </Box>
                <Box alignContent='center' alignSelf='center' align='center' gridArea='characs' fill={true}>
                    <TicketCharacs
                        marketer={marketer}
                        approver={approver}
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
                        image={this.props.queued_event.image}
                        event_address={this.props.queued_event.address}
                        name={this.props.queued_event.name}
                        strapi_url={this.props.strapi_url}
                        t={this.props.t}
                        event_begin={this.props.queued_event.start}
                        infos={this.props.categories && this.props.categories.length > 0 ? [this.props.categories[this.state.selection].name] : []}
                    />
                </Box>
            </Grid>
        </div>;
    }
}

const mapStateToProps = (state: AppState, ownProps: QueuedEventTicketsGridProps): QueuedEventTicketsGridRState => {

    let error = null;
    let categories = null;

    if (ownProps.minters && ownProps.queued_event && ownProps.contract) {

        const minter_type_idx = ownProps.minters.findIndex((minter: StrapiMinter): boolean =>
            minter.id === ownProps.queued_event.type.minter);

        if (minter_type_idx === -1) {
            error = 'unknown_minter';
        } else {
            const minter_name = ownProps.minters[minter_type_idx].name;

            categories = MinterCategoriesGetter(minter_name, ownProps.contract);
        }

    }

    return {
        error,
        categories
    };
};

export default I18N.withNamespaces(['events'])(
    connect(mapStateToProps)(
        QueuedEventTicketsGrid
    )
) as React.ComponentType<QueuedEventTicketsGridProps>;
