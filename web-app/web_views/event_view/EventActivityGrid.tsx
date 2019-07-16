import * as React                  from 'react';
import { Box, Grid }               from 'grommet';
import { Typography }              from 'antd';
import { I18N, I18NProps }         from '@utils/misc/i18n';
import { StrapiEvent }             from '@utils/strapi/event';
import dynamic                     from 'next/dynamic';
import { EventActivityTableProps } from '@web_components/event/display/EventActivityTable';
import { StrapiAddress }           from '@utils/strapi/address';
import { theme }                   from '../../utils/theme';

// Dynamic Components

const EventActivityTable: React.ComponentType<EventActivityTableProps> = dynamic<EventActivityTableProps>(async () => import('@web_components/event/display/EventActivityTable'), {
    loading: (): React.ReactNode => null
});

// Props

export interface EventActivityGridProps {
    event: StrapiEvent;
    address: StrapiAddress;
}

type MergedEventActivityGridProps = EventActivityGridProps & I18NProps;

class QueuedEventTicketsGrid extends React.Component<MergedEventActivityGridProps> {

    render(): React.ReactNode {

        return <div
            style={{marginBottom: 24}}
        >
            <br/>
            <Typography.Text
                style={{fontSize: 42, color: theme.primary}}
            >
                {this.props.t('ticket_activity_title')}
            </Typography.Text>
            <Grid
                style={{marginTop: 24}}
                fill={'horizontal'}
                rows={['auto']}
                columns={['full']}
                gap='small'
                areas={[
                    {name: 'activity', start: [0, 0], end: [0, 0]}
                ]}
            >
                <Box alignContent='center' alignSelf='center' align='center' gridArea='activity' fill={true}>
                    <EventActivityTable event={this.props.event} address={this.props.address} t={this.props.t}/>
                </Box>
            </Grid>
        </div>;
    }
}

export default I18N.withNamespaces(['events'])(
    QueuedEventTicketsGrid
) as React.ComponentType<EventActivityGridProps>;
