import * as React                                                                 from 'react';
import { connect }                                                                from 'react-redux';
import { AppState, StatusState }                                                  from './redux/state';
import { LoadingScreen }                                                          from './rn/screens/loading_screen';
import BootNetworkSelectionScreen                                                 from './rn/screens/boot_network_selection_screen';
import { createAppContainer, createBottomTabNavigator, NavigationContainerProps } from 'react-navigation';
import EventsScreen                                                               from './rn/screens/events';
import SettingsScreen                                                             from './rn/screens/settings';
import BottomTabBar                                                               from './rn/components/BottomTabBar';

const AppNavigator = createBottomTabNavigator({
        Events: {
            screen: EventsScreen
        },
        Settings: {
            screen: SettingsScreen
        }
    },
    {
        initialRouteName: 'Events',
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
                return (
                    <LoadingScreen/>
                );

            case StatusState.BootNetworkChoice:
                return (
                    <BootNetworkSelectionScreen/>
                );

            case StatusState.DeviceReady:
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
