import * as React                                               from 'react';
import { AppState, Image, NetworkInfos, Event as EventInfos }   from '../../../redux/state';
import { View }                                                 from 'react-native';
import EventIcon                                                from '../../components/EventIcon';
import { connect }                                              from 'react-redux';
import EventBody                                                from './EventBody';
import { Dispatch }                                             from 'redux';
import { LoadImage }                                            from '../../../redux/actions/images';

export interface EventProps {
    event: EventInfos;
}

interface EventRState {
    strapi_url: string;
    image: {
        sources: Image;
        loading: boolean;
    };
}

interface EventRDispatch {
    load_img: (hash: string, url: string) => void;
}

type EventMergedProps = EventProps & EventRState & EventRDispatch;

class Event extends React.Component<EventMergedProps> {

    private readonly loadImages = (nextProps: Readonly<EventMergedProps>): void => {
        if (nextProps.strapi_url) {
            if (nextProps.event.image) {
                if (nextProps.image === undefined) {
                    nextProps.load_img(nextProps.event.image.hash, nextProps.strapi_url + nextProps.event.image.url);
                }
            }
        }
    }

    componentWillUpdate(nextProps: Readonly<EventMergedProps>, nextState: Readonly<{}>, nextContext: any): void {
        this.loadImages(nextProps);
    }

    componentDidMount(): void {
        this.loadImages(this.props);
    }

    render(): React.ReactNode {

        return <View
                style={{
                    width: '95%',
                    marginHorizontal: '2.5%',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
        >
                    <EventIcon
                        height={130}
                        width={130}
                        event={this.props.event}
                        strapi_url={this.props.strapi_url}
                        image={this.props.image}
                    />
                    <EventBody event={this.props.event}/>
        </View>;
    }
}

const mapStateToProps = (state: AppState, ownProps: EventProps): EventRState => {
    const net = state.device.network_list.findIndex((net: NetworkInfos): boolean => net.name === state.device.current_network);

    let strapi_url;

    if (net !== -1) {
        strapi_url = state.device.network_list[net].strapi_url;
    } else {
        strapi_url = null;
    }

    let image = null;

    if (ownProps.event.image) {
        image = state.images[ownProps.event.image.hash];
    }

    return {
        strapi_url,
        image
    };

};

const mapDispatchToProps = (dispatch: Dispatch): EventRDispatch => ({
    load_img: (hash: string, url: string): void => void dispatch(LoadImage(url, hash))
});

export default connect(mapStateToProps, mapDispatchToProps)(Event) as React.ComponentType<EventProps>;
