import * as React                                 from 'react';
import { Ticket }                                 from '../../../redux/state';
import { View }                                   from 'react-native';
import { Text, ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import moment                                     from 'moment';
import { themeResolver }                          from '../../utils/themeResolver';

export interface TicketBodyProps {
    ticket: Ticket;
}

type TicketBodyMergedProps = TicketBodyProps & ThemedComponentProps;

class TicketBody extends React.Component<TicketBodyMergedProps> {
    render(): React.ReactNode {

        const date = this.props.ticket.event.start ? moment(this.props.ticket.event.start).format('DD MMM YYYY') : null;

        return <View style={{flex: 1, padding: 5, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Text numberOfLines={1} style={{fontSize: 20, marginBottom: 10}}>{this.props.ticket.event.name}</Text>
            {date
                ?
                <Text style={{fontSize: 30, lineHeight: 30, fontWeight: '200'}}>{date}</Text>
                :
                <View style={{height: 30}}/>
            }
            <Text style={{fontSize: 15, lineHeight: 15, marginTop: 10}}>T<Text style={{fontWeight: '500', color: themeResolver('color-primary-500', this.props.theme)}}>{this.props.ticket.ticket_id.toString()}</Text></Text>
        </View>;
    }
}

export default withStyles(TicketBody) as React.ComponentType<TicketBodyProps>;
