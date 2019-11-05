import * as React                                               from 'react';
import { ImageProps, View }                                     from 'react-native';
import {
    Button,
    StyleType,
    ThemedComponentProps,
    TopNavigation,
    withStyles,
    TopNavigationActionProps,
    TopNavigationAction
}                                                               from 'react-native-ui-kitten';
import { CustomStatusBar }                                      from '../../../utils/CustomStatusBar';
import { I18N }                                                 from '../../../../i18n';
import { AppState, Event, Image as CacheImage, NetworkInfos }   from '../../../../redux/state';
import { NavigationInjectedProps }                              from 'react-navigation';
import { connect }                                              from 'react-redux';
import { Ionicons }                                             from '@expo/vector-icons';
import { Dispatch }                                             from 'redux';
import { LoadImage }                                            from '../../../../redux/actions/images';
import { ScrollView }                                           from 'react-native-gesture-handler';
import EventInfos                                               from './EventInfos';
import EventMedia                                               from './EventMedia';

export interface EventDetailsProps {
}

interface EventDetailsRState {
    current_event: Event;
    strapi_url: string;
    image: {
        sources: CacheImage;
        loading: boolean;
    };
    banners: {
        [key: string]: {
            sources: CacheImage;
            loading: boolean;
        }
    };
}

interface EventDetailsRDispatch {
    load_img: (hash: string, url: string) => void;
}

export type EventDetailsMergedProps =
    EventDetailsProps
    & EventDetailsRState
    & EventDetailsRDispatch
    & ThemedComponentProps
    & NavigationInjectedProps;

class EventDetails extends React.Component<EventDetailsMergedProps> {
    
    componentWillUpdate(nextProps: Readonly<EventDetailsMergedProps>): void {
        this.loadImages(nextProps);
    }

    componentDidMount(): void {
        this.loadImages(this.props);
    }

    private readonly loadImages = (nextProps: Readonly<EventDetailsMergedProps>): void => {
        if (nextProps.strapi_url) {
            if (nextProps.current_event.image) {
                if (nextProps.image === undefined) {
                    nextProps.load_img(nextProps.current_event.image.hash, nextProps.strapi_url + nextProps.current_event.image.url);
                }
            }
            
            if (nextProps.current_event.banners) {
                for (const banner of nextProps.current_event.banners) {
                    if (nextProps.banners[banner.hash] === undefined) {
                        nextProps.load_img(banner.hash, nextProps.strapi_url + banner.url);
                    }
                }
            }
        }
    }

    private readonly renderControlLeftIcon = (style: StyleType): React.ReactElement<ImageProps> =>
        (
            <Ionicons name='ios-arrow-back' size={style.width} color={style.tintColor} />
        )

    private readonly onLeftControlPress = (): void => {
        this.props.navigation.pop();
    }

    private readonly renderLeftControl = (): React.ReactElement<TopNavigationActionProps> =>
        (
            <TopNavigationAction
                icon={
                    this.renderControlLeftIcon.bind(null, {
                        width: 35,
                        tintColor: 'white'
                    })
                }
                onPress={this.onLeftControlPress}
            />
        )

    private readonly renderControlRightIcon = (style: StyleType): React.ReactElement<ImageProps> =>
    (
        <Ionicons name='ios-barcode' size={style.width} color={style.tintColor} />
    )

    private readonly onRightControlPress = (): void => {
        this.props.navigation.push('TicketScanner');
    }

    private readonly renderRightControl = (): React.ReactElement<TopNavigationActionProps> =>
        (
            <TopNavigationAction
                icon={
                    this.renderControlRightIcon.bind(null, {
                        width: 35,
                        tintColor: 'white'
                    })
                }
                onPress={this.onRightControlPress}
            />
        )
    
    on_verified_tickets_press = (): void => {
        this.props.navigation.push('VerifiedList', {
            event_name: this.props.current_event.name
        });
    }

    render(): React.ReactNode {
        const containerBackgroundColor = this.props.theme['color-basic-1000'];
        const statusBarBackgroundColor = this.props.theme['color-basic-800'];

        return <View style={{height: '100%', backgroundColor: containerBackgroundColor}}>
            <CustomStatusBar containerBackgroundColor={statusBarBackgroundColor} barStyle={'light-content'}/>
            <TopNavigation
                title={this.props.current_event.name}
                titleStyle={{fontSize: 20, lineHeight: 20}}
                alignment={'center'}
                leftControl={this.renderLeftControl()}
                rightControls={this.renderRightControl()}
            />
            <ScrollView>
                <EventMedia
                    event={this.props.current_event}
                    strapi_url={this.props.strapi_url}
                    image={this.props.image}
                    banners={this.props.banners}
                />
                <EventInfos
                    start={this.props.current_event.start}
                    end={this.props.current_event.end}
                    location={this.props.current_event.location}
                    description={this.props.current_event.description}
                />
                <Button
                    style={{
                        width: 160,
                        borderRadius: 5,
                        borderWidth: 0,
                        backgroundColor: '#313F79',
                        marginTop: 20,
                        alignSelf: 'center',
                        shadowOpacity: 0.2,
                        shadowRadius: 5
                    }}
                    textStyle={{
                        fontWeight: '200'
                    }}
                    onPress={this.on_verified_tickets_press}
                >
                    {I18N.t('verified_tickets_button')}
                </Button>
            </ScrollView>
        </View>;
    }
}

const mapStateToProps = (state: AppState): EventDetailsRState => {
    const event_idx = state.events.findIndex((event: Event): boolean => event.id === state.device.current_event);

    let current_event = null;

    if (event_idx !== -1) {
        current_event = state.events[event_idx];
    }

    const net_idx = state.device.network_list.findIndex((net: NetworkInfos): boolean => net.name === state.device.current_network);

    let strapi_url = null;

    if (net_idx !== -1) {
        strapi_url = state.device.network_list[net_idx].strapi_url;
    }

    let image = null;

    if (current_event.image) {
        image = state.images[current_event.image.hash];
    }

    const banners = {};

    if (current_event.banners) {
        for (const banner of current_event.banners) {
            banners[banner.hash] = state.images[banner.hash];
        }
    }

    return {
        current_event,
        strapi_url,
        image,
        banners
    };
};

const mapDispatchToProps = (dispatch: Dispatch): EventDetailsRDispatch => ({
    load_img: (hash: string, url: string): void => void dispatch(LoadImage(url, hash))
});

export default withStyles(
    connect(mapStateToProps, mapDispatchToProps)(
        EventDetails
    )
);
