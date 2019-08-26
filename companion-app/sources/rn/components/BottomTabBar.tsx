import * as React           from 'react';
import {
    BottomNavigation,
    BottomNavigationTab,
    StyleType
}                           from 'react-native-ui-kitten';
import {
    NavigationContainerProps,
    NavigationInjectedProps,
    withNavigation,
}                           from 'react-navigation';
import { Entypo, Ionicons } from '@expo/vector-icons';

export interface BottomTabBarProps {

}

type BottomTabBarMergedProps = BottomTabBarProps & NavigationContainerProps & NavigationInjectedProps;

class BottomTabBar extends React.Component<BottomTabBarMergedProps> {

    private readonly ticketsIcon = (style: StyleType): React.ReactElement => {
        const color = style.tintColor;
        delete style.tintColor;
        return <Entypo
            size={style.width}
            style={{
                marginVertical: style.marginVertical,
                color
            }}
            name={'ticket'}
        />;
    }

    private readonly settingsIcon = (style: StyleType): React.ReactElement => {
        const color = style.tintColor;
        delete style.tintColor;
        return <Ionicons
            size={style.width}
            style={{
                marginVertical: style.marginVertical,
                color
            }}
            name={'md-settings'}
        />;
    }

    render = (): React.ReactNode => {

        const onTabSelect = (selectedIndex: number): void => {
            const {[selectedIndex]: selectedRoute}: any = this.props.navigation.state.routes;

            this.props.navigation.navigate(selectedRoute.routeName);
        };

        return (
            <BottomNavigation
                selectedIndex={this.props.navigation.state.index}
                onSelect={onTabSelect}
            >
                <BottomNavigationTab title='Tickets' icon={this.ticketsIcon}/>
                <BottomNavigationTab title='Settings' icon={this.settingsIcon}/>
            </BottomNavigation>
        );
    }
}

export default withNavigation(BottomTabBar);
