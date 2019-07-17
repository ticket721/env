import * as React               from 'react';
import { DescriptionCardProps } from '@web_components/event/display/DescriptionCard';
import dynamic                  from 'next/dynamic';
import { Box, Grid }            from 'grommet';
import { Typography }           from 'antd';
import { DatesCardProps }       from '@web_components/event/display/DatesCard';
import { I18N, I18NProps }      from '@utils/misc/i18n';
import { MapCardProps }         from '@web_components/event/display/MapCard';
import { StrapiEvent }          from '@utils/strapi/event';
import { theme }                from '../../utils/theme';

// Dynamic Components

const DescriptionCard: React.ComponentType<DescriptionCardProps> = dynamic<DescriptionCardProps>(async () => import('@web_components/event/display/DescriptionCard'), {
    loading: (): React.ReactNode => null
});

const DatesCard: React.ComponentType<DatesCardProps> = dynamic<DatesCardProps>(async () => import('@web_components/event/display/DatesCard'), {
    loading: (): React.ReactNode => null
});

const MapCard: React.ComponentType<MapCardProps> = dynamic<MapCardProps>(async () => import('@web_components/event/display/MapCard'), {
    loading: (): React.ReactNode => null
});

// Props

export interface EventInformationGridProps {
    event: StrapiEvent;
}

type MergedEventInformationGridProps = EventInformationGridProps & I18NProps;

class EventInformationGrid extends React.Component<MergedEventInformationGridProps> {
    render(): React.ReactNode {
        return <div>
            <br/>
            <Typography.Text style={{fontSize: 42, color: theme.primary}}>{this.props.t('general_informations_title')}</Typography.Text>
            <Grid
                style={{marginTop: 24}}
                fill={'horizontal'}
                rows={['auto', 'auto']}
                columns={['1/2', '1/4', '1/4']}
                gap='small'
                areas={[
                    {name: 'dates', start: [0, 1], end: [0, 1]},
                    {name: 'description', start: [0, 0], end: [0, 0]},
                    {name: 'map', start: [1, 0], end: [2, 1]}
                ]}
            >
                <Box
                    alignContent='center'
                    alignSelf='center'
                    align='center'
                    gridArea='description'
                    fill={true}
                >
                    <DescriptionCard description={this.props.event.description} t={this.props.t}/>
                </Box>
                <Box
                    alignContent='center'
                    alignSelf='center'
                    align='center'
                    gridArea='dates'
                    fill={true}
                >
                    <DatesCard
                        start={this.props.event.start}
                        end={this.props.event.end}
                        creation={this.props.event.creation}
                        t={this.props.t}
                    />
                </Box>
                <Box alignContent='center' alignSelf='center' align='center' gridArea='map' fill={true}>
                    <MapCard location={this.props.event.location} t={this.props.t}/>
                </Box>
            </Grid>
        </div>;
    }
}

export default I18N.withNamespaces(['events'])(EventInformationGrid) as React.ComponentType<EventInformationGridProps>;
