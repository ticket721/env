import * as React                                               from 'react';
import { AppState, Image, NetworkInfos, Ticket as TicketInfos } from '../../../redux/state';
import { View }                                                 from 'react-native';
import EventIcon                                                from './EventIcon';
import { connect }                                              from 'react-redux';
import TicketBody                                               from './TicketBody';
import { Dispatch }                                             from 'redux';
import { LoadImage }                                            from '../../../redux/actions/images';

export interface TicketProps {
    ticket: TicketInfos;
}

interface TicketRState {
    strapi_url: string;
    images: {
        [key: string]: {
            sources: Image;
            loading: boolean;
        }
    };
}

interface TicketRDispatch {
    load_img: (hash: string, url: string) => void;
}

type TicketMergedProps = TicketProps & TicketRState & TicketRDispatch;

class Ticket extends React.Component<TicketMergedProps> {

    private readonly loadImages = (nextProps: Readonly<TicketMergedProps>): void => {
        if (nextProps.strapi_url) {
            if (nextProps.ticket.event.image) {
                if (nextProps.images[nextProps.ticket.event.image.hash] === undefined) {
                    nextProps.load_img(nextProps.ticket.event.image.hash, nextProps.strapi_url + nextProps.ticket.event.image.url);
                }
            }

            if (nextProps.ticket.event.banners) {
                for (const banner of nextProps.ticket.event.banners) {
                    if (nextProps.images[banner.hash] === undefined) {
                        nextProps.load_img(banner.hash, nextProps.strapi_url + banner.url);
                    }
                }
            }
        }
    }

    componentWillUpdate(nextProps: Readonly<TicketMergedProps>, nextState: Readonly<{}>, nextContext: any): void {
        this.loadImages(nextProps);
    }

    componentDidMount(): void {
        this.loadImages(this.props);
    }

    render(): React.ReactNode {

        return <View style={{flex: 1, flexDirection: 'row'}}>
            <EventIcon
                height={150}
                width={150}
                event={this.props.ticket.event}
                strapi_url={this.props.strapi_url}
                images={this.props.images}
            />
            <TicketBody ticket={this.props.ticket}/>
        </View>;
    }
}

const mapStateToProps = (state: AppState, ownProps: TicketProps): TicketRState => {
    const net = state.device.network_list.findIndex((net: NetworkInfos): boolean => net.name === state.device.current_network);

    let strapi_url;

    if (net !== -1) {
        strapi_url = state.device.network_list[net].strapi_url;
    } else {
        strapi_url = null;
    }

    const images = {};

    if (ownProps.ticket.event.image) {
        images[ownProps.ticket.event.image.hash] = state.images[ownProps.ticket.event.image.hash];
    }

    if (ownProps.ticket.event.banners) {
        for (const banner of ownProps.ticket.event.banners) {
            images[banner.hash] = state.images[banner.hash];
        }
    }

    return {
        strapi_url,
        images
    };

};

const mapDispatchToProps = (dispatch: Dispatch): TicketRDispatch => ({
    load_img: (hash: string, url: string): void => void dispatch(LoadImage(url, hash))
});

export default connect(mapStateToProps, mapDispatchToProps)(Ticket) as React.ComponentType<TicketProps>;
