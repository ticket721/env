import * as React                       from 'react';
import { connect }                      from 'react-redux';
import {
    View, ListRenderItemInfo, ImageProps
}                                       from 'react-native';
import {
    List, ListItem, ListItemProps,
    StyleType, ThemedComponentProps,
    TopNavigation, TopNavigationAction,
    TopNavigationActionProps, withStyles,
    Text, Button
}                                       from 'react-native-ui-kitten';
import { CustomStatusBar }              from '../../utils/CustomStatusBar';
import { AntDesign }                    from '@expo/vector-icons';
import { I18N }                         from '../../../i18n';
import {
    AppState, NetworkInfos
}                                       from '../../../redux/state';
import { themeResolver }                from '../../utils/themeResolver';
import { networkUrlPrettier }           from '../../utils/networkUrlPrettier';
import { Modal }                        from '@ant-design/react-native';
import { statusBarHeight }              from '../../utils/statusBarHeight';
import { bump }                         from '../../utils/bump';
import AddNetworkModal                  from './AddNetworkModal';
import Swipeable                        from 'react-native-gesture-handler/Swipeable';
import { Dispatch }                     from 'redux';
import { Start }                        from '../../../redux/actions/status';
import { RemoveNetwork, SelectNetwork } from '../../../redux/actions/device';

export interface BootNetworkSelectionScreenProps {

}

interface BootNetworkSelectionScreenRState {
    networks: NetworkInfos[];
}

interface BootNetworkSelectionScreenRDispatch {
    start: () => void;
    selectNetwork: (net_name: string) => void;
    deleteNetwork: (net_name: string) => void;
}

interface BootNetworkSelectionScreenState {
    new_network_visible: boolean;
}

type BootNetworkSelectionScreenMergedProps =
    BootNetworkSelectionScreenProps
    & ThemedComponentProps
    & BootNetworkSelectionScreenRState
    & BootNetworkSelectionScreenRDispatch;

class BootNetworkSelectionScreen extends React.Component<BootNetworkSelectionScreenMergedProps, BootNetworkSelectionScreenState> {

    state: BootNetworkSelectionScreenState = {
        new_network_visible: false
    };

    componentDidMount(): void {
        bump();
    }

    private readonly renderRightActions = (net_name: string, progress: any, dragX: any): React.ReactNode => {

        const on_press = (): void => {
            this.props.deleteNetwork(net_name);
        };

        return (
            <Button
                status={'danger'}
                style={{
                    flex: 0.2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0
                }}
                onPress={on_press}
            >
                {I18N.t('boot_network_remove_button')}

            </Button>
        );
    }

    private readonly renderItem = (info: ListRenderItemInfo<NetworkInfos>): React.ReactElement<ListItemProps> => {

        const on_selection = (net_name: string): void => {
            this.props.selectNetwork(net_name);
        };

        return (
            <Swipeable renderRightActions={this.renderRightActions.bind(null, info.item.name)}>
                <ListItem
                    onPress={on_selection.bind(null, info.item.name)}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column'
                        }}
                    >
                        <Text category={'s1'} style={{marginLeft: 6}}>{info.item.name}</Text>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 6,
                                marginBottom: 6
                            }}
                        >
                            <AntDesign
                                name={'API'}
                                color={themeResolver('text-hint-color', this.props.theme)}
                                style={{marginRight: 6, marginLeft: 12}}
                                size={12}
                            />
                            <Text appearance={'hint'} category={'c1'}>{
                                networkUrlPrettier(info.item.eth_node_url)
                            }</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <AntDesign
                                name={'hdd'}
                                color={themeResolver('text-hint-color', this.props.theme)}
                                style={{marginRight: 6, marginLeft: 12}}
                                size={12}
                            />
                            <Text appearance={'hint'} category={'c1'}>{
                                networkUrlPrettier(info.item.strapi_url)
                            }</Text>
                        </View>
                    </View>
                </ListItem>
            </Swipeable>
        );
    }

    private readonly renderPlusIcon = (style: StyleType): React.ReactElement<ImageProps> =>
        (
            <AntDesign size={style.width} name='plus' color={'#ffffff'}/>
        )

    private readonly toggleModal = (): void => {
        this.setState({
            new_network_visible: !this.state.new_network_visible
        });
    }

    private readonly renderRightControlPlusIcon = (): React.ReactElement<TopNavigationActionProps> =>
        (
            <TopNavigationAction
                icon={this.renderPlusIcon}
                onPress={this.toggleModal}
            />
        )

    render = (): React.ReactNode => {

        const containerBackgroundColor = this.props.theme['color-basic-1000'];
        const statusBarBackgroundColor = this.props.theme['color-basic-800'];

        return <View style={{height: '100%', backgroundColor: containerBackgroundColor}}>
            <View>
                <CustomStatusBar containerBackgroundColor={statusBarBackgroundColor} barStyle={'light-content'}/>
                <TopNavigation
                    title={I18N.t('boot_network_selection_title')}
                    subtitle={I18N.t('boot_network_selection_subtitle')}
                    alignment={'start'}
                    rightControls={this.renderRightControlPlusIcon()}
                />
            </View>
            <List
                data={this.props.networks}
                renderItem={this.renderItem}
            />
            <Modal
                transparent={true}
                visible={this.state.new_network_visible}
                animationType='slide-down'
                maskClosable={true}
                onClose={this.toggleModal}
                style={{
                    width: '100%',
                    position: 'absolute',
                    top: statusBarHeight(),
                    borderRadius: 0
                }}
            >
                <AddNetworkModal
                    toggle={this.toggleModal}
                />
            </Modal>
        </View>;
    }
}

const mapStateToProps = (state: AppState): BootNetworkSelectionScreenRState => ({
    networks: state.device.network_list
});

const mapDispatchToProps = (dispatch: Dispatch): BootNetworkSelectionScreenRDispatch => ({
    start: (): void => void dispatch(Start()),
    selectNetwork: (net_name: string): void => void dispatch(SelectNetwork(net_name)),
    deleteNetwork: (net_name: string): void => void dispatch(RemoveNetwork(net_name))
});

export default withStyles(
    connect(mapStateToProps, mapDispatchToProps)(
        BootNetworkSelectionScreen
    )
);
