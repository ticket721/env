import * as React                                               from 'react';
import { View, StyleSheet, ImageProps }                         from 'react-native';
import {
    ThemedComponentProps,
    TopNavigation,
    Text,
    withStyles,
    StyleType,
    TopNavigationActionProps,
    TopNavigationAction
}                                                               from 'react-native-ui-kitten';
import { CustomStatusBar }                                      from '../../../utils/CustomStatusBar';
import { I18N }                                                 from '../../../../i18n';
import * as Permissions                                         from 'expo-permissions';
import { BarCodeScanner }                                       from 'expo-barcode-scanner';
import { BarCodeEvent }                                         from '../';
import { AppState }                                             from '../../../../redux/state';
import { connect }                                              from 'react-redux';
import { GetEventInfos }                                        from '../../../../redux/actions/events';
import { Dispatch }                                             from 'redux';
import { NavigationInjectedProps }                              from 'react-navigation';
import { Ionicons }                                             from '@expo/vector-icons';
import { UpdateScanState, AddMessage }                          from '../../../../redux/actions/device';

export interface EventScannerScreenProps {

}

interface EventScannerScreenRState {
    onScan: boolean;
}

interface EventScannerScreenRDispatch {
    addNewEvent: (event_address: string) => void;
    updateScanState: (on: boolean) => void;
    invalidQRCode: () => void;
}

interface EventScannerScreenState {
    hasCameraPermission: boolean;
    onScan: boolean;
    onPop: boolean;
}

export type EventScannerScreenMergedProps =
    EventScannerScreenProps
    & ThemedComponentProps
    & NavigationInjectedProps
    & EventScannerScreenRState
    & EventScannerScreenRDispatch;

class EventScannerScreen extends React.Component<EventScannerScreenMergedProps, EventScannerScreenState> {

    state: EventScannerScreenState = {
        hasCameraPermission: null,
        onScan: false,
        onPop: false
    };

    async componentDidMount(): Promise<void> {
        this.getPermissionsAsync();
    }

    componentDidUpdate(prevProps: EventScannerScreenMergedProps): void {
        if (this.props.onScan === !prevProps.onScan && !this.state.onPop) {
            if (!this.props.onScan) {
                setTimeout(() => {
                    this.setState({
                        onScan: this.props.onScan
                    });
                }, 2000);
            } else {
                this.setState({
                    onScan: this.props.onScan
                });
            }
        }
    }

    private readonly renderControlIcon = (style: StyleType): React.ReactElement<ImageProps> =>
        (
            <Ionicons name='ios-arrow-back' size={style.width} color={style.tintColor} />
        )

    private readonly onLeftControlPress = (): void => {
        this.props.navigation.pop();
    }

    private readonly renderLeftControl = (): React.ReactElement<TopNavigationActionProps> =>
        (
            <TopNavigationAction
                icon={this.renderControlIcon}
                onPress={this.onLeftControlPress}
            />
        )

    private async getPermissionsAsync(): Promise<void> {
        const { status }: Permissions.PermissionResponse = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    private handleBarCodeScanned(data: string): void {
        this.props.updateScanState(true);
        
        if (
            data.length !== 42
            || data.substring(0, 2) !== '0x'
        ) {
            this.props.invalidQRCode();
            this.props.updateScanState(false);
            return;
        }
        
        this.setState({
            onPop: true
        });
        this.props.addNewEvent(data);
        this.props.navigation.pop();
    }

    render(): React.ReactNode {
        const containerBackgroundColor = this.props.theme['color-basic-1000'];
        const statusBarBackgroundColor = this.props.theme['color-basic-800'];
        const { hasCameraPermission, onScan }: EventScannerScreenState = this.state;

        if (hasCameraPermission === null) {
            return <Text>{I18N.t('requesting_permission')}</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>{I18N.t('no_access')}</Text>;
        }
        
        return <View style={{height: '100%', backgroundColor: containerBackgroundColor}}>
            <CustomStatusBar containerBackgroundColor={statusBarBackgroundColor} barStyle={'light-content'}/>
            <TopNavigation
                title={I18N.t('event_scanner_title')}
                titleStyle={{fontSize: 20, lineHeight: 20}}
                alignment={'center'}
                leftControl={this.renderLeftControl()}
            />
            <View
                style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end'
                }}
            >
                <BarCodeScanner
                    type={BarCodeScanner.Constants.Type.back}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    onBarCodeScanned={
                        onScan
                        ?
                        undefined
                        :
                        ({data}: BarCodeEvent): void => this.handleBarCodeScanned(data)}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
        </View>;
    }
}

const mapStateToProps = (state: AppState): EventScannerScreenRState => ({
    onScan: state.device.onScan
});

const mapDispatchToProps = (dispatch: Dispatch): EventScannerScreenRDispatch => ({
    addNewEvent: (event_address: string): void => void dispatch(GetEventInfos(event_address)),
    updateScanState: (on: boolean): void => void dispatch(UpdateScanState(on)),
    invalidQRCode: (): void => void dispatch(AddMessage('invalid_qr', 'error'))
});

export default withStyles(
    connect(mapStateToProps, mapDispatchToProps)(
        EventScannerScreen
    )
);
