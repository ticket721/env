import * as React                     from 'react';
import { AppState }                   from '@utils/redux/app_state';
import { connect }                    from 'react-redux';
import StrapiCall                     from '@components/strapi';
import { FullPageLoader }             from '@web_components/loaders/FullPageLoader';
import { StrapiCallFn, StrapiHelper } from '@utils/StrapiHelper';
import EventDisplayer                 from './EventDisplayer';
import { StrapiAddress }              from '@utils/strapi/address';
import { NotAnEvent }                 from '../message/not_an_event';
import { RGA }                        from '../../utils/misc/ga';

// Props

export interface EventViewProps {
    address: string;
    coinbase: StrapiAddress;
}

interface EventViewRState {
    strapi_url: string;
}

type MergedEventViewProps = EventViewProps & EventViewRState;

const filter_query_result = (qr: any[]): any[] => {

    // Removing Errored qr
    let real_qr;
    if (qr) {
        real_qr = [];
        for (const minter of qr) {
            if (minter.data) {
                real_qr.push(minter.data);
            }
        }
    } else {
        real_qr = qr;
    }

    return real_qr;
};

class EventView extends React.Component<MergedEventViewProps> {

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + window.location.search);
    }

    render(): React.ReactNode {

        if (!this.props.address) {
            return <FullPageLoader/>;
        }

        return <StrapiCall
            calls={{
                address: StrapiHelper.getEntries('addresses', {address: this.props.address}),
                event_contract: {
                    call: (arg: any): StrapiCallFn => StrapiHelper.getEntry('eventcontracts', arg),
                    requires: 'address',
                    converter: (arg: any): any => {
                        if (arg.length && arg[0].data && arg[0].data.event && arg[0].data.linked_event) {
                            return arg[0].data.linked_event.eventcontract;
                        }
                        return null;
                    }
                },
                event: {
                    call: (arg: any): StrapiCallFn => StrapiHelper.getEntry('events', arg),
                    requires: 'address',
                    converter: (arg: any): any => {
                        if (arg.length && arg[0].data && arg[0].data.event && arg[0].data.linked_event) {
                            return arg[0].data.linked_event.id;
                        }
                        return null;
                    }
                }
            }}
            static={['event_contract']}
        >
            {({address, event_contract, event}: { address: any[]; event_contract: any[], event: any[]}): React.ReactNode => {

                event_contract = filter_query_result(event_contract);
                address = filter_query_result(address);
                event = filter_query_result(event);

                if ((address && address.length && (address[0].event === false || !address[0].linked_event))
                    || (address && address.length === 0)) {
                    return <NotAnEvent/>;
                }

                if (address && event_contract && event) {

                    return <EventDisplayer
                        strapi_url={this.props.strapi_url}
                        address={address[0]}
                        event={event[0]}
                        event_type={event_contract[0]}
                        coinbase={this.props.coinbase}
                    />;

                } else {
                    return <FullPageLoader message={'event_loading'}/>;
                }
            }}
        </StrapiCall>;

    }
}

const mapStateToProps = (state: AppState): EventViewRState => ({
    strapi_url: state.app.config.strapi_endpoint
});

export default connect(mapStateToProps)(EventView);
