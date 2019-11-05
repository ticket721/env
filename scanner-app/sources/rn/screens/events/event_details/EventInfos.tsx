import * as React                      from 'react';
import { View }                        from 'react-native';
import {
    withStyles,
    Text,
    ThemedComponentProps
}                                      from 'react-native-ui-kitten';
import moment                          from 'moment';
import { Ionicons }                    from '@expo/vector-icons';
import { screenWidth }                 from '../../../utils/screenDimensions';
import { themeResolver }               from '../../../utils/themeResolver';

export interface EventInfosProps {
    start: string;
    end: string;
    location: string;
    description: string;
}

export type EventMediaMergedProps =
    EventInfosProps
    & ThemedComponentProps;

class EventInfos extends React.Component<EventMediaMergedProps> {
    render(): React.ReactNode {
        return <View
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: screenWidth() - 30,
                marginHorizontal: 15,
                marginTop: 10,
            }}
        >
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: 150,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        fontWeight: '200',
                        fontSize: 16
                    }}
                >
                    {moment(this.props.start).format('DD MMM YYYY')}
                </Text>
                <Ionicons name='ios-arrow-round-forward' size={25} color={themeResolver('color-basic-300', this.props.theme)}/>
                <Text
                    style={{
                        fontWeight: '200',
                        fontSize: 16
                    }}
                >
                    {moment(this.props.end).format('DD MMM YYYY')}
                </Text>
            </View>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                    marginLeft: 150
                }}
            >
                <Ionicons name='ios-pin' size={25} color='white'/>
                <Text
                    style={{
                        marginLeft: 10,
                        fontSize: 18,
                        fontWeight: '200',
                        flexWrap: 'wrap'
                    }}
                >
                    {this.props.location}
                </Text>
            </View>
            <Text
                style={{
                    marginTop: 25,
                    fontSize: 14,
                    fontWeight: '200'
                }}
            >
                {this.props.description}
            </Text>
        </View>;
    }
}

export default withStyles(
    EventInfos
);
