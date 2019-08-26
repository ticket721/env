import * as React                                                                    from 'react';
import { ImageProps, View }          from 'react-native';
import { Button, Input, StyleType, ThemedComponentProps, TopNavigation, withStyles } from 'react-native-ui-kitten';
import { CustomStatusBar }                                                           from '../../utils/CustomStatusBar';
import { I18N }                   from '../../../i18n';
import TicketList                 from './TicketList';
import { AppState, Ticket }       from '../../../redux/state';
import { connect }                from 'react-redux';
import Fuse                       from 'fuse.js';
import { InputComponent }         from 'react-native-ui-kitten/ui/input/input.component';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator }   from 'react-navigation';
import TicketDetails              from './TicketDetails';

export interface TicketsPageProps {

}

interface TicketsPageRState {
    tickets: Ticket[];
}

interface TicketsPageState {
    query: string;
    input_focus: boolean;
}

export type TicketsPageMergedProps = TicketsPageProps & ThemedComponentProps & TicketsPageRState;

class TicketsPage extends React.Component<TicketsPageMergedProps, TicketsPageState> {

    state: TicketsPageState = {
        query: null,
        input_focus: false
    };

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
                'event.name',
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
                            minHeight: 40
                        }}
                        title={I18N.t('tickets_title')}
                        alignment={'start'}
                    />
            }
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: statusBarBackgroundColor,
                    padding: 6,
                    paddingHorizontal: 6
                }}
            >
                <Input
                    ref={this.set_ref}
                    placeholder={I18N.t('tickets_search_title')}
                    style={{height: 40, width: this.state.input_focus ? '80%' : '100%', margin: 0}}
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
            <TicketList
                tickets={
                    this.filter_tickets(
                        this.props.tickets
                    )
                }
            />
        </View>;
    }
}

const mapStateToProps = (state: AppState): TicketsPageRState => ({
    tickets: state.tickets,
});

const wrappedTicketList = withStyles(
    connect(mapStateToProps)(
        TicketsPage
    )
);

export default createStackNavigator({
        List: {
            screen: wrappedTicketList,
        },
        Details: {
            screen: TicketDetails
        }
    },
    {
        initialRouteName: 'List',
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    });
