import * as React       from 'react';
import StrapiCall       from '@components/strapi';
import { StrapiEvent }  from '../../../utils/strapi/event';
import { StrapiHelper } from '../../../utils/StrapiHelper';
import EventCard        from './EventCard';

export interface EventCardFetcherProps {
    event: StrapiEvent;
    refresh?: boolean;
}

type MergedEventCardFetcherProps = EventCardFetcherProps;

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

export default class EventCardFetcher extends React.Component<MergedEventCardFetcherProps> {
    render(): React.ReactNode {

        if (this.props.event) {
            return <StrapiCall
                calls={{
                    eventcontract: StrapiHelper.getEntry('eventcontracts', this.props.event.eventcontract.id)
                }}
                always_refresh={this.props.refresh}
            >
                {({eventcontract}: {eventcontract: any[]}): React.ReactNode => {
                    eventcontract = filter_strapi(eventcontract);

                    return <EventCard
                        event={this.props.event}
                        event_contract={eventcontract && eventcontract.length ? eventcontract[0] : undefined}
                    />;
                }}

            </StrapiCall>;
        } else {
            return <EventCard
                event={this.props.event}
                event_contract={undefined}
            />;
        }
    }
}
