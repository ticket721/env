import * as React                                           from 'react';
import { ImageProps, View }                                 from 'react-native';
import {
    Button,
    Input,
    StyleType,
    ThemedComponentProps,
    TopNavigation,
    withStyles,
    TopNavigationActionProps,
    TopNavigationAction
}                                                           from 'react-native-ui-kitten';
import { CustomStatusBar }                                  from '../../utils/CustomStatusBar';
import { I18N }                                             from '../../../i18n';
import EventList                                            from './EventList';
import { AppState, Event }                                  from '../../../redux/state';
import { connect }                                          from 'react-redux';
import Fuse                                                 from 'fuse.js';
import { InputComponent }                                   from 'react-native-ui-kitten/ui/input/input.component';
import { MaterialCommunityIcons, AntDesign }                from '@expo/vector-icons';
import { createStackNavigator, NavigationInjectedProps }    from 'react-navigation';
import EventScanner                                         from './event_scanner';
import EventDetails                                         from './event_details';
import TicketScanner                                        from './ticket_scanner';
import VerifiedList                                         from './verified_list';
import { Dispatch } from 'redux';
import { PingServer } from '../../../redux/actions/device';

export declare type BarCodeEvent = {
    type: string;
    data: string;
};

export interface EventsScreenProps {

}

interface EventsScreenRState {
    events: Event[];
}

interface EventsScreenRDispatch {
    pingServer: () => void;
}

interface EventsScreenState {
    query: string;
    input_focus: boolean;
}

export type EventsScreenMergedProps =
    EventsScreenProps
    & ThemedComponentProps
    & NavigationInjectedProps
    & EventsScreenRState
    & EventsScreenRDispatch;

class EventsScreen extends React.Component<EventsScreenMergedProps, EventsScreenState> {

    state: EventsScreenState = {
        query: null,
        input_focus: false
    };

    componentWillMount(): void {
        this.props.pingServer();
    }

    on_plus_press = (): void => {
        this.props.navigation.push('EventScanner');
    }

    private readonly renderPlusIcon = (style: StyleType): React.ReactElement<ImageProps> =>
        (
            <AntDesign size={style.width} name='plus' color={'#ffffff'}/>
        )

    private readonly renderRightControlPlusIcon = (): React.ReactElement<TopNavigationActionProps> =>
        (
            <TopNavigationAction
                icon={this.renderPlusIcon}
                onPress={this.on_plus_press}
            />
        )

    private readonly on_change = (new_value: string): void => {
        this.setState({
            query: new_value
        });
    }

    input_ref: InputComponent = null;

    private readonly set_ref = (ref: InputComponent): void => {
        this.input_ref = ref;
    }

    private readonly on_focus = (): void => {
        this.setState({
            input_focus: true
        });
    }

    private readonly on_blur = (): void => {
        this.setState({
            input_focus: false
        });
    }

    private readonly filter_events = (events: Event[]): Event[] => {
        if (this.state.query === null || this.state.query === '') return events;

        const options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                'name'
            ]
        };

        const fuse = new Fuse(events, options);
        return fuse.search(this.state.query);
    }

    cancel_icon = (style: StyleType): React.ReactElement<ImageProps> => {
        const color = style.tintColor;
        delete style.tintColor;
        return <MaterialCommunityIcons
            size={style.width}
            style={{
                color
            }}
            name={'cancel'}
        />;
    }

    clear_input = (): void => {
        this.input_ref.blur();
        this.input_ref.clear();
        this.setState({
            query: null
        });
    }

    render(): React.ReactNode {
        const containerBackgroundColor = this.props.theme['color-basic-1000'];
        const statusBarBackgroundColor = this.props.theme['color-basic-800'];

        return <View style={{height: '100%', backgroundColor: containerBackgroundColor}}>
            <CustomStatusBar containerBackgroundColor={statusBarBackgroundColor} barStyle={'light-content'}/>
            {
                this.state.input_focus
                    ?
                    <View style={{height: 10, backgroundColor: statusBarBackgroundColor}}/>
                    :
                    <TopNavigation
                        style={{
                            minHeight: 80
                        }}
                        title={I18N.t('events_title')}
                        alignment={'start'}
                        rightControls={this.renderRightControlPlusIcon()}
                    />
            }
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: statusBarBackgroundColor,
                    padding: 6,
                }}
            >
                <Input
                    ref={this.set_ref}
                    placeholder={I18N.t('events_search_title')}
                    style={{
                        height: 40,
                        width: this.state.input_focus ? '80%' : '100%',
                        margin: 0
                    }}
                    size={'small'}
                    value={this.state.query}
                    onChangeText={this.on_change}
                    onFocus={this.on_focus}
                    onBlur={this.on_blur}
                />
                {
                    this.state.input_focus

                        ?
                        <Button
                            appearance={'outline'}
                            status={'danger'}
                            size={'small'}
                            style={{height: 40, width: '18%', marginLeft: '2%', borderWidth: 2}}
                            icon={this.cancel_icon}
                            onPress={this.clear_input}
                        />

                        :
                        null
                }
            </View>
            <EventList
                events={
                    this.filter_events(
                        this.props.events
                    )
                }
            />
        </View>;
    }
}

const mapStateToProps = (state: AppState): EventsScreenRState => {
        const events = state.events.sort(
            (prev: Event, next: Event) => Date.parse(prev.start) - Date.parse(next.start)
        );

        return {
            events
        };
};

const mapDispatchToProps = (dispatch: Dispatch): EventsScreenRDispatch => ({
    pingServer: (): void => void dispatch(PingServer())
});

const wrappedEventList = withStyles(
    connect(mapStateToProps, mapDispatchToProps)(
        EventsScreen
    )
);

export default createStackNavigator({
        EventList: {
            screen: wrappedEventList
        },
        EventScanner: {
            screen: EventScanner
        },
        EventDetails: {
            screen: EventDetails
        },
        TicketScanner: {
            screen: TicketScanner
        },
        VerifiedList: {
            screen: VerifiedList,
        }
    },
    {
        initialRouteName: 'EventList',
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    });
