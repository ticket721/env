import * as React                                                                 from 'react';
import { connect }                                                                from 'react-redux';
import { AppState, StatusState }                                                  from './redux/state';
import { LoadingScreen }                                                          from './rn/pages/loading_screen';
import BootNetworkSelectionScreen
                                                                                  from './rn/pages/boot_network_selection_screen';
import { createAppContainer, createBottomTabNavigator, NavigationContainerProps } from 'react-navigation';
import TicketsPage                                                                from './rn/pages/tickets';
import SettingsPage                                                               from './rn/pages/settings';
import BottomTabBar                                                               from './rn/components/BottomTabBar';
import LinkT721                                                                   from './rn/pages/link_t721';

const AppNavigator = createBottomTabNavigator({
        Tickets: {
            screen: TicketsPage
        },
        Settings: {
            screen: SettingsPage
        }
    },
    {
        initialRouteName: 'Tickets',
        tabBarComponent: (props: NavigationContainerProps): any => <BottomTabBar/>
    },
);

const App = createAppContainer(AppNavigator);

export interface MainProps {

}

interface MainRState {
    status: StatusState;
}

type MainMergedProps = MainProps & MainRState;

class Main extends React.Component<MainMergedProps> {
    render = (): React.ReactNode => {
        switch (this.props.status) {

            case StatusState.Loading:
            case StatusState.DeviceReady:
                return (
                    <LoadingScreen/>
                );
            case StatusState.NotLinked:
                return (
                    <LinkT721/>
                );

            case StatusState.BootNetworkChoice:
                return (
                    <BootNetworkSelectionScreen/>
                );

            case StatusState.LinkedAndReady:
                return (
                    <App/>
                );

        }
    }
}

const mapStateToProps = (state: AppState): MainRState => ({
    status: state.status
});

export default connect(mapStateToProps)(Main);
