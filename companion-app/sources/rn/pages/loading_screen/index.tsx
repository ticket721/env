import * as React                                                           from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar, Animated, Easing } from 'react-native';

export interface LoadingScreenProps {

}

type LoadingScreenMergedProps = LoadingScreenProps;

export class LoadingScreen extends React.Component<LoadingScreenMergedProps> {
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

    render = (): React.ReactNode => {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        return <View style={styles.animationContainer}>
            <StatusBar hidden={true}/>
            <Animated.Image style={{position: 'absolute', transform: [{rotate: spin}]}} source={require('../../../assets/loader_background.png')}/>
            <View style={styles.container}>
                <Image style={{width: Dimensions.get('window').width / 2}} source={require('../../../assets/logo_white.png')} resizeMode={'contain'}/>
            </View>
        </View>;
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
