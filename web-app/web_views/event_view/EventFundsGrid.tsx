import * as React          from 'react';
import { Box, Grid }       from 'grommet';
import { Typography }      from 'antd';
import { I18N, I18NProps } from '@utils/misc/i18n';
import { StrapiEvent }   from '@utils/strapi/event';
import { StrapiAddress } from '@utils/strapi/address';
import { theme }         from '../../utils/theme';
import FundCard          from '../../web_components/event/display/FundCard';
import { VtxContract }   from 'ethvtx/lib/contracts/VtxContract';
import { AppState }      from '../../utils/redux/app_state';
import { getAccount }    from 'ethvtx/lib/accounts/helpers/getters';
import { Account }       from 'ethvtx/lib/state/accounts';
import { connect }       from 'react-redux';

// Props

export interface EventFundsGridProps {
    event: StrapiEvent;
    coinbase: StrapiAddress;
    contract: VtxContract;
}

interface EventFundsGridRState {
    balance: Account;
}

type MergedEventFundsGridProps = EventFundsGridProps & I18NProps & EventFundsGridRState;

class EventFundsGrid extends React.Component<MergedEventFundsGridProps> {

    is_active = (): boolean => {
        if (!this.props.contract || !this.props.event || !this.props.coinbase) return false;
        if (this.props.coinbase.address.toLowerCase() !== this.props.event.owner.address.toLowerCase()) return false;
        return true;
    }

    render(): React.ReactNode {
        if (!this.is_active()) return null;

        return <div
        >
            <br/>
            <Typography.Text
                style={{fontSize: 42, color: theme.primary}}
            >
                {this.props.t('event_funds_title')}
            </Typography.Text>
            <Grid
                style={{marginTop: 24}}
                fill={'horizontal'}
                rows={['auto']}
                columns={['1/2', '1/2']}
                gap='small'
                areas={[
                    {name: 'funds', start: [0, 0], end: [0, 0]}
                ]}
            >
                <Box alignContent='center' alignSelf='center' align='center' gridArea='funds' fill={true}>
                    <FundCard balance={this.props.balance && this.props.balance.balance ? this.props.balance.balance.toString() : undefined} t={this.props.t} contract={this.props.contract}/>
                </Box>
            </Grid>
        </div>;
    }
}

const mapStateToProps = (state: AppState, ownProps: EventFundsGridProps): EventFundsGridRState => ({
    balance: getAccount(state, ownProps.event ? ownProps.event.address.address : undefined)
});

export default I18N.withNamespaces(['events'])(
    connect(mapStateToProps)(
        EventFundsGrid
    )
) as React.ComponentType<EventFundsGridProps>;
