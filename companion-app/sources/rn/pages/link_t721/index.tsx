import * as React                                                                       from 'react';
import { Dimensions, View, StyleSheet, StatusBar, Animated, Easing, ActivityIndicator } from 'react-native';
import { ThemedComponentProps, withStyles, Text }                                       from 'react-native-ui-kitten';
import { I18N }                                                                         from '../../../i18n';
import { connect }                                                                      from 'react-redux';
import { AppState, NetworkInfos }                                                       from '../../../redux/state';

export interface LinkT721Props {

}

interface LinkT721RState {
    link_code: string;
}

export type LinkT721MergedProps = LinkT721Props & LinkT721RState & ThemedComponentProps;

class LinkT721 extends React.Component<LinkT721MergedProps> {
    private readonly spinValue: Animated.Value = new Animated.Value(0);

    startAnimation = (): void => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(500),
                Animated.timing(
                    this.spinValue,
                    {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.linear
                    }
                )
            ])
        ).start(() => {
            this.startAnimation();
        });
    }

    componentDidMount(): void {
        this.startAnimation();
    }

    render(): React.ReactNode {
        const containerBackgroundColor = this.props.theme['color-basic-1000'];
        const statusBarBackgroundColor = this.props.theme['color-basic-800'];

        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        if (this.props.link_code !== null) {
            return <View style={styles.animationContainer}>
                <StatusBar hidden={true}/>
                <Animated.Image
                    style={{position: 'absolute', transform: [{rotate: spin}]}}
                    source={require('../../../assets/loader_background.png')}
                />
                <View style={styles.container}>
                    <Text category={'h3'}>{this.props.link_code}</Text>
                    <Text category={'p1'}>{I18N.t('linker_indication')}</Text>
                </View>
            </View>;
        } else {
            return <View style={styles.animationContainer}>
                <StatusBar hidden={true}/>
                <Animated.Image
                    style={{position: 'absolute', transform: [{rotate: spin}]}}
                    source={require('../../../assets/loader_background.png')}
                />
                <View style={styles.container}>
                    <ActivityIndicator color={'white'}/>
                </View>
            </View>;
        }
    }
}

const styles = StyleSheet.create({
    animationContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#131313'
    },
    container: {
        flex: 1,
        width: Dimensions.get('window').width * 0.98,
        marginTop: '1%',
        height: '10%',
        backgroundColor: '#131313',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const mapStateToProps = (state: AppState): LinkT721RState => {
    const net_idx = state.device.network_list.findIndex((net: NetworkInfos): boolean => net.name === state.device.current_network);

    if (net_idx !== -1) {
        return {
            link_code: state.device.network_list[net_idx].link_code
        };
    }

    return {
        link_code: null
    };
};

export default withStyles(
    connect(mapStateToProps)
    (
        LinkT721
    )
);
