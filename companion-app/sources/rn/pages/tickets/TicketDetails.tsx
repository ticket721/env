import * as React                                                           from 'react';
import {
    StyleType,
    ThemedComponentProps,
    TopNavigation, TopNavigationAction,
    TopNavigationActionProps,
    withStyles
} from 'react-native-ui-kitten';
import { ImageProps, View }                                                 from 'react-native';
import { CustomStatusBar }                                                  from '../../utils/CustomStatusBar';
import { AppState, Ticket }                                                 from '../../../redux/state';
import { NavigationInjectedProps }                                          from 'react-navigation';
import TicketQRCode                                                         from './TicketQRCode';
import { Dispatch }                                                         from 'redux';
import { SetCurrentTicket }                                      from '../../../redux/actions/device';
import { connect }                                               from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

export interface TicketDetailsProps {
}

interface TicketDetailsRDispatch {
    set_ticket: (ticket_id: number) => void;
}

type TicketDetailsMergedProps = TicketDetailsProps & ThemedComponentProps & NavigationInjectedProps & TicketDetailsRDispatch;

class TicketDetails extends React.Component<TicketDetailsMergedProps> {

    componentDidMount(): void {
        const ticket: Ticket = this.props.navigation.getParam('ticket');
        this.props.set_ticket(ticket.ticket_id);
    }

    componentWillUnmount(): void {
        this.props.set_ticket(null);
    }

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

    render(): React.ReactNode {

        const ticket: Ticket = this.props.navigation.getParam('ticket');

        const containerBackgroundColor = this.props.theme['color-basic-1000'];
        const statusBarBackgroundColor = this.props.theme['color-basic-800'];

        return <View style={{height: '100%', backgroundColor: containerBackgroundColor}}>
            <CustomStatusBar containerBackgroundColor={statusBarBackgroundColor} barStyle={'light-content'}/>
            <TopNavigation
                title={`T${ticket.ticket_id}`}
                titleStyle={{fontSize: 25, lineHeight: 25}}
                subtitleStyle={{fontSize: 16, lineHeight: 16, marginTop: 6}}
                subtitle={ticket.event.name}
                alignment={'center'}
                leftControl={this.renderLeftControl()}
            />
            <View style={{padding: 10, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TicketQRCode ticket_id={ticket.ticket_id}/>
            </View>
        </View>;
    }
}

const mapStateToProps = (state: AppState): any => ({});

const mapDispatchToProps = (dispatch: Dispatch): TicketDetailsRDispatch => ({
    set_ticket: (ticket_id: number): void => void dispatch(SetCurrentTicket(ticket_id))
});

export default withStyles(
    connect(mapStateToProps, mapDispatchToProps)(
        TicketDetails
    )
);
