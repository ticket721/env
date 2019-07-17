import * as React                     from 'react';
import { AppState }                   from '@utils/redux/app_state';
import { connect }                    from 'react-redux';
import StrapiCall                     from '@components/strapi';
import { StrapiCallFn, StrapiHelper } from '@utils/StrapiHelper';
import { FullPageLoader }             from '@web_components/loaders/FullPageLoader';
import { StrapiTicket }               from '../../utils/strapi/ticket';
import TicketLayout                   from './TicketLayout';
import { StrapiAddress }              from '../../utils/strapi/address';
import { StrapiEvent }                from '../../utils/strapi/event';
import { NoTicketId }                 from '../message/no_ticket_id';
import { RGA }                        from '../../utils/misc/ga';

// Props

export interface TicketViewProps {
    id: string;
    coinbase: StrapiAddress;
}

interface TicketViewRState {
    coinbase_string: string;
}

interface TicketViewState {
}

type MergedTicketViewProps = TicketViewProps & TicketViewRState;

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

class TicketView extends React.Component<MergedTicketViewProps, TicketViewState> {

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + window.location.search);
    }

    render(): React.ReactNode {

        return <StrapiCall
            calls={{
                ticket: StrapiHelper.getEntries('tickets', {ticket_id: this.props.id}),
                event: {
                    call: (arg: any): StrapiCallFn => StrapiHelper.getEntry('events', arg),
                    requires: 'ticket',
                    converter: (arg: any): any => {
                        if (arg.length && arg[0].data && arg[0].data.event && arg[0].data) {
                            return arg[0].data.event.id;
                        }
                        return null;
                    }
                }
            }}
        >
            {({ticket, event}: any): React.ReactNode => {

                ticket = filter_strapi(ticket) as StrapiTicket[];
                event = filter_strapi(event) as StrapiEvent[];

                if (ticket && this.props.coinbase_string) {
                    if (ticket.length) {
                        return <TicketLayout coinbase={this.props.coinbase} ticket={ticket[0]} coinbase_string={this.props.coinbase_string} event={event && event.length ? event[0] : undefined}/>;
                    } else {
                        return <NoTicketId/>;
                    }
                } else {
                    return <FullPageLoader message={'ticket_page_loading'}/>;
                }
            }}
        </StrapiCall>;
    }
}

const mapStateToProps = (state: AppState, ownProps: TicketViewProps): TicketViewRState =>
    ({
        coinbase_string: state.vtxconfig.coinbase
    });

export default connect(mapStateToProps)(TicketView);
