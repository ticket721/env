import React                                        from 'react';
import {
    ThemedComponentProps,
    Text,
    withStyles
}                                                   from 'react-native-ui-kitten';
import { View }                                     from 'react-native';
import { themeResolver }                            from '../../../utils/themeResolver';
import moment                                       from 'moment';
import { UserInfos }                                from '../../../../redux/state';

export interface TicketRowProps {
    id: number;
    owner: UserInfos;
    timestamp: number;
}

interface TicketRowRState {
}

export type TicketRowMergedProps =
    TicketRowProps
    & ThemedComponentProps
    & TicketRowRState;

class TicketRow extends React.Component<TicketRowMergedProps> {

    render(): React.ReactNode {
        return <View
                style={{
                    width: '100%',
                    height: 60,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
        >
            <View style={{width: '33.33%', alignItems: 'center'}}>
                <Text style={{fontSize: 20}}>
                    T<Text style={{fontSize: 20, color: themeResolver('color-primary-500', this.props.theme)}}>
                        {this.props.id.toString()}
                    </Text>
                </Text>
            </View>
            <View style={{width: '33.33%', alignItems: 'center'}}>
                <Text>{'#' + this.props.owner.user_id}</Text>
                {
                    this.props.owner.username
                    ?
                    <Text>{this.props.owner.username}</Text>
                    :
                    null
                }
            </View>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '33.33%'
                }}
            >
                <Text style={{fontSize: 15, fontWeight: '200'}}>
                    {moment(this.props.timestamp).format('HH:mm:ss')}
                </Text>
                <Text style={{fontSize: 12, color: '#777', fontWeight: '200'}}>
                    {moment(this.props.timestamp).format('DD MMM YYYY')}
                </Text>
            </View>
        </View>;
    }
}

export default withStyles(
    TicketRow
);
