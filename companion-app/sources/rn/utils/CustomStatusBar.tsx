import * as React          from 'react';
import { StatusBar, View } from 'react-native';
import { statusBarHeight } from './statusBarHeight';

export interface CustomStatusBarProps {
    containerBackgroundColor: string;
    barStyle: 'light-content' | 'dark-content';
}

type CustomStatusBarMergedProps = CustomStatusBarProps;

export class CustomStatusBar extends React.Component<CustomStatusBarMergedProps> {
    render = (): React.ReactNode =>
        <View style={{height: statusBarHeight(), backgroundColor: this.props.containerBackgroundColor}}>
            <StatusBar barStyle={this.props.barStyle} translucent={true}/>
        </View>
}
