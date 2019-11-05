import * as React                                                          from 'react';
import { AppState, Event }                                                 from '../../../redux/state';
import { connect }                                                         from 'react-redux';
import { ListRenderItemInfo, ScrollView, RefreshControl }                  from 'react-native';
import {
    List,
    ListItem,
    ListItemProps,
    withStyles,
    ThemedComponentProps,
    Button
}                                                                          from 'react-native-ui-kitten';
import EventComponent                                                      from './Event';
import { Dispatch }                                                        from 'redux';
import { I18N }                                                            from '../../../i18n';
import { RefreshEvents }                                                   from '../../../redux/actions/events';
import { NavigationInjectedProps, withNavigation }                         from 'react-navigation';
import { SetCurrentEvent }                                                 from '../../../redux/actions/device';
import { RemoveEvent }                                                     from '../../../redux/actions/events';
import Swipeable                                                           from 'react-native-gesture-handler/Swipeable';
import { screenWidth }                                                     from '../../utils/screenDimensions';

export interface EventListProps {
    events: Event[];
}

interface EventListRState {
    refreshing: boolean;
}

interface EventListRDispatch {
    refresh: () => void;
    setCurrentEvent: (event_id: number) => void;
    deleteEvent: (event_id: number) => void;
}

type EventListMergedProps =
    EventListProps
    & EventListRState
    & EventListRDispatch
    & ThemedComponentProps
    & NavigationInjectedProps;

class EventList extends React.Component<EventListMergedProps> {

    private readonly renderRightActions = (event_id: number, progress: any, dragX: any): React.ReactNode => {

        const on_press = (): void => {
            this.props.deleteEvent(event_id);
        };

        return (
            <Button
                status={'danger'}
                style={{
                    flex: 0.2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0
                }}
                onPress={on_press}
            >
                {I18N.t('event_remove_button')}

            </Button>
        );
    }

    on_item_click = (event: Event): void => {
        this.props.setCurrentEvent(event.id);
        this.props.navigation.navigate('EventDetails');
    }

    renderItem = (info: ListRenderItemInfo<Event>): React.ReactElement<ListItemProps> =>
        <Swipeable renderRightActions={this.renderRightActions.bind(null, info.item.id)}>
            <ListItem
                style={{
                    width: screenWidth() - 24,
                    paddingHorizontal: 0,
                    paddingVertical: 15,
                    marginHorizontal: 12,
                    backgroundColor: 'none',
                    borderBottomColor: '#333',
                    borderBottomWidth: 1
                }}
                onPress={this.on_item_click.bind(null, info.item)}
            >
                <EventComponent event={info.item}/>
            </ListItem>
        </Swipeable>

    render(): React.ReactNode {
        return <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={this.props.refreshing}
                    onRefresh={
                        this.props.events.length > 0
                        ?
                        this.props.refresh
                        :
                        null
                    }
                />
            }
        >
            <List
                data={this.props.events}
                renderItem={this.renderItem}
                style={{
                    backgroundColor: 'none'
                }}
            />
        </ScrollView>;
    }
}

const mapStateToProps = (state: AppState): EventListRState => ({
    refreshing: state.device.refreshing
});

const mapDispatchToProps = (dispatch: Dispatch): EventListRDispatch => ({
    refresh: (): void => void dispatch(RefreshEvents()),
    setCurrentEvent: (event_id: number): void => void dispatch(SetCurrentEvent(event_id)),
    deleteEvent: (event_id: number): void => void dispatch(RemoveEvent(event_id))
});

export default withNavigation(
    withStyles(
        connect(mapStateToProps, mapDispatchToProps)(EventList)
    ) as React.ComponentType<EventListMergedProps>
) as React.ComponentType<EventListProps>;
