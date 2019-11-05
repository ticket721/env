import * as React                                 from 'react';
import { Event }                                  from '../../../redux/state';
import { View }                                   from 'react-native';
import { Text, ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import moment                                     from 'moment';
import { Icon }                                   from '@ant-design/react-native';
import { screenWidth }                            from '../../utils/screenDimensions';

export interface EventBodyProps {
    event: Event;
}

type EventBodyMergedProps = EventBodyProps & ThemedComponentProps;

class EventBody extends React.Component<EventBodyMergedProps> {

    renderDate(date: string): React.ReactElement<Text | View> {
        if (date) {
            return <Text
                    style={{
                        fontSize: 18,
                        lineHeight: 30,
                        fontWeight: '200'
                    }}
            >
                {date}
            </Text>;
        }
        return <View style={{height: 20}}/>;
    }

    render(): React.ReactNode {

        const startDate = this.props.event.start ? moment(this.props.event.start).format('DD MMM YYYY') : null;
        const endDate = this.props.event.end ? moment(this.props.event.end).format('DD MMM YYYY') : null;

        return <View
                style={{
                    width: screenWidth() - 24 - 130,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
        >
            <Text
                numberOfLines={1}
                style={{
                    fontSize: 20,
                    paddingBottom: 10
                }}
            >
                {this.props.event.name}
            </Text>
            {this.renderDate(startDate)}
            <Icon name='arrow-down' size='xs' />
            {this.renderDate(endDate)}
        </View>;
    }
}

export default withStyles(EventBody) as React.ComponentType<EventBodyProps>;
