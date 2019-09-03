import * as React                                                          from 'react';
import { AppState, Ticket }                                                from '../../../redux/state';
import { connect }                                                         from 'react-redux';
import { View, ListRenderItemInfo, ScrollView, RefreshControl }            from 'react-native';
import { List, ListItem, ListItemProps, withStyles, ThemedComponentProps } from 'react-native-ui-kitten';
import { LinearGradient }                                                  from 'expo-linear-gradient';
import { themeResolver }                                                   from '../../utils/themeResolver';
import TicketComponent                                                     from './Ticket';
import { Dispatch }                                                        from 'redux';
import { RefreshTickets }                                                  from '../../../redux/actions/tickets';
import { NavigationInjectedProps, withNavigation }                         from 'react-navigation';

export interface TicketListProps {
    tickets: Ticket[];
}

interface TicketListRState {
    refreshing: boolean;
}

interface TicketListRDispatch {
    refresh: () => void;
}

type TicketListMergedProps =
    TicketListProps
    & TicketListRState
    & TicketListRDispatch
    & ThemedComponentProps
    & NavigationInjectedProps;

class TicketList extends React.Component<TicketListMergedProps> {

    on_item_click = (ticket: Ticket): void => {
        this.props.navigation.navigate('Details', {
            ticket
        });
    }

    renderItem = (info: ListRenderItemInfo<Ticket>): React.ReactElement<ListItemProps> =>
        <ListItem
            style={{
                marginTop: 10,
                marginBottom: 10,
                width: '96%',
                marginLeft: '2%',
                backgroundColor: undefined
            }}
            onPress={this.on_item_click.bind(null, info.item)}
        >
            <View
                style={{
                    flex: 1,
                    height: 150,
                }}
            >
                <View
                    style={{
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                        borderBottomRightRadius: 18,
                        borderTopRightRadius: 6,
                        overflow: 'hidden',
                    }}
                >
                    <LinearGradient
                        colors={[themeResolver('color-basic-700', this.props.theme), themeResolver('color-basic-800', this.props.theme)]}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        start={[0, 1]}
                        end={[1, 0]}
                    >
                        <TicketComponent ticket={info.item}/>
                    </LinearGradient>
                </View>
            </View>
        </ListItem>

    render(): React.ReactNode {
        return <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={this.props.refreshing}
                    onRefresh={this.props.refresh}
                />
            }
        >
            <List
                style={{backgroundColor: themeResolver('color-basic-1000', this.props.theme)}}
                data={this.props.tickets}
                renderItem={this.renderItem}
            />
        </ScrollView>;
    }
}

const mapStateToProps = (state: AppState): TicketListRState => ({
    refreshing: state.device.refreshing
});

const mapDispatchToProps = (dispatch: Dispatch): TicketListRDispatch => ({
    refresh: (): void => void dispatch(RefreshTickets())
});

export default withNavigation(
    withStyles(
        connect(mapStateToProps, mapDispatchToProps)(TicketList)
    ) as React.ComponentType<TicketListMergedProps>
) as React.ComponentType<TicketListProps>;
