import * as React           from 'react';
import {
    BottomNavigation,
    BottomNavigationTab,
    StyleType,
    ThemedComponentProps,
    withStyles
}                           from 'react-native-ui-kitten';
import {
    NavigationContainerProps,
    NavigationInjectedProps,
    withNavigation,
    NavigationParams,
}                           from 'react-navigation';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { themeResolver } from '../utils/themeResolver';
import { connect }                                          from 'react-redux';
import { AppState } from '../../redux/state';

export interface BottomTabBarProps {

}

export interface BottomTabBarRState {
    scanResult: string;
}

type BottomTabBarMergedProps =
    BottomTabBarProps
    & NavigationContainerProps
    & NavigationInjectedProps
    & ThemedComponentProps
    & BottomTabBarRState;

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

        const event_route_idx = this.props.navigation.state.routes.findIndex((route: NavigationParams) => route.key === 'Events');
        const routes = this.props.navigation.state.routes[event_route_idx].routes;

        const onTabSelect = (selectedIndex: number): void => {
            const {[selectedIndex]: selectedRoute}: any = this.props.navigation.state.routes;

            this.props.navigation.navigate(selectedRoute.routeName);
        };

        return (routes[routes.length - 1].routeName !== 'TicketScanner'
            ?
            <BottomNavigation
                selectedIndex={this.props.navigation.state.index}
                onSelect={onTabSelect}
            >
                    <BottomNavigationTab title='Events' icon={this.ticketsIcon}/>
                    <BottomNavigationTab title='Settings' icon={this.settingsIcon}/>
            </BottomNavigation>
            :
            null
        );
    }
}

const mapStateToProps = (state: AppState): BottomTabBarRState => ({
    scanResult: state.device.scanResult
});

export default withStyles(
    withNavigation(
        connect(mapStateToProps)(
            BottomTabBar
        )
    )
);
