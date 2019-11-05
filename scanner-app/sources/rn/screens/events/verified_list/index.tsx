import React                                        from 'react';
import { connect }                                  from 'react-redux';
import {
    ThemedComponentProps,
    StyleType,
    Button,
    Input,
    TopNavigationActionProps,
    TopNavigationAction,
    TopNavigation,
    List,
    ListItemProps,
    ListItem,
    Text,
    withStyles
}                                                   from 'react-native-ui-kitten';
import { NavigationInjectedProps }                  from 'react-navigation';
import { ImageProps, View, ListRenderItemInfo }     from 'react-native';
import { Ionicons, MaterialCommunityIcons }         from '@expo/vector-icons';
import { CustomStatusBar }                          from '../../../utils/CustomStatusBar';
import { I18N }                                     from '../../../../i18n';
import { Ticket, AppState }                         from '../../../../redux/state';
import { themeResolver }                            from '../../../utils/themeResolver';
import Fuse                                         from 'fuse.js';
import { InputComponent }                           from 'react-native-ui-kitten/ui/input/input.component';
import TicketRow                                    from './TicketRow';

export interface VerifiedTicketsProps {
}

interface VerifiedTicketsRState {
    ticketList: Ticket[];
}

interface VerifiedTicketsState {
    query: string;
    input_focus: boolean;
}

export type VerifiedTicketsMergedProps =
    VerifiedTicketsProps
    & ThemedComponentProps
    & NavigationInjectedProps
    & VerifiedTicketsRState;

class VerifiedTickets extends React.Component<VerifiedTicketsMergedProps, VerifiedTicketsState> {
    event_name: string = this.props.navigation.getParam('event_name');

    state: VerifiedTicketsState = {
        query: null,
        input_focus: false
    };
    
    private readonly renderControlIcon = (style: StyleType): React.ReactElement<ImageProps> =>
        (
            <Ionicons name='ios-arrow-back' size={style.width} color={style.tintColor} />
        )

    private readonly onLeftControlPress = (): void => {
        this.props.navigation.pop();
    }

    private readonly renderLeftControl = (): React.ReactElement<TopNavigationActionProps> =>
        (
            <TopNavigationAction
                icon={this.renderControlIcon}
                onPress={this.onLeftControlPress}
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

    private readonly filter_tickets = (tickets: Ticket[]): Ticket[] => {
        if (this.state.query === null || this.state.query === '') return tickets;

        const options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                'username',
                'ticket_id'
            ]
        };

        const fuse = new Fuse(tickets, options);
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
    
    renderItem = (info: ListRenderItemInfo<Ticket>): React.ReactElement<ListItemProps> =>
    <ListItem
        style={{
            width: '100%',
            backgroundColor: themeResolver('color-basic-700', this.props.theme),
            borderBottomColor: themeResolver('color-basic-500', this.props.theme),
            borderBottomWidth: 1,
            borderTopColor: themeResolver('color-basic-500', this.props.theme),
            borderTopWidth: !info.index ? 1 : 0
        }}
    >
        <TicketRow
            id={info.item.ticket_id}
            owner={info.item.owner}
            timestamp={info.item.timestamp}
        />
    </ListItem>

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
                    title={I18N.t('verified_tickets_title')}
                    titleStyle={{fontSize: 20, lineHeight: 20}}
                    subtitle={this.event_name}
                    subtitleStyle={{fontSize: 18, lineHeight: 18, marginTop: 5}}
                    alignment={'center'}
                    leftControl={this.renderLeftControl()}
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
                placeholder={I18N.t('tickets_search_title')}
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
        {
            this.props.ticketList.length > 0
            ?
            <List
                style={{backgroundColor: themeResolver('color-basic-1000', this.props.theme)}}
                data={
                    this.filter_tickets(this.props.ticketList)
                }
                renderItem={this.renderItem}
            />
            :
            <View style={{height: '85%', justifyContent: 'center'}}>
                <Text style={{color: '#444', fontSize: 20, fontWeight: '300', alignSelf: 'center'}}>
                    {I18N.t('empty_ticket_list')}
                </Text>
            </View>
        }
        </View>;
    }
}

const mapStateToProps = (state: AppState): VerifiedTicketsRState => ({
    ticketList: state.verified_tickets
});

export default withStyles(
    connect(mapStateToProps)(
        VerifiedTickets
    )
);
