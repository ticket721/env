import * as React                                           from 'react';
import { View, ImageProps, StyleSheet, ActivityIndicator }  from 'react-native';
import {
    ThemedComponentProps,
    TopNavigation,
    Text,
    withStyles,
    StyleType,
    TopNavigationActionProps,
    TopNavigationAction
}                                                           from 'react-native-ui-kitten';
import { CustomStatusBar }                                  from '../../../utils/CustomStatusBar';
import { I18N }                                             from '../../../../i18n';
import * as Permissions                                     from 'expo-permissions';
import { BarCodeScanner }                                   from 'expo-barcode-scanner';
import { BarCodeEvent }                                     from '../';
import { UpdateScanState, AddMessage, UpdateScanResult }                      from '../../../../redux/actions/device';
import { VerifyTicketQRCode }                               from '../../../../redux/actions/tickets';
import { AppState }                                         from '../../../../redux/state';
import { NavigationInjectedProps }                          from 'react-navigation';
import { connect }                                          from 'react-redux';
import { Dispatch }                                         from 'redux';
import { Ionicons }                                         from '@expo/vector-icons';
import { pad }                                              from '../../../utils/pad';
import { screenHeight } from '../../../utils/screenDimensions';
import { themeResolver } from '../../../utils/themeResolver';
import { bump } from '../../../utils/bump';

export interface TicketScannerScreenProps {

}

interface TicketScannerScreenRState {
    onScan: boolean;
    scanResult: string;
}

interface TicketScannerScreenRDispatch {
    verifiedTicket: (timestamp: number, ticket_id: number, signature: string) => void;
    updateScanState: (on: boolean) => void;
    resetScanResult: () => void;
    invalidQRCode: () => void;
    deprecatedQRCode: () => void;
}

interface TicketScannerScreenState {
    hasCameraPermission: boolean;
    onScan: boolean;
    theme: string;
    message: string;

}

export type TicketScannerScreenMergedProps =
TicketScannerScreenProps
    & ThemedComponentProps
    & NavigationInjectedProps
    & TicketScannerScreenRState
    & TicketScannerScreenRDispatch;

class TicketScannerScreen extends React.Component<TicketScannerScreenMergedProps, TicketScannerScreenState> {

    state: TicketScannerScreenState = {
        hasCameraPermission: null,
        onScan: false,
        theme: themeResolver('color-basic-800', this.props.theme),
        message: 'notify_scan'
    };

    async componentDidMount(): Promise<void> {
        this.getPermissionsAsync();
    }

    componentDidUpdate(prevProps: TicketScannerScreenMergedProps): void {
        if (this.props.onScan === !prevProps.onScan) {
            if (!this.props.onScan) {

                setTimeout(() => {
                    this.setState({
                        onScan: this.props.onScan
                    });

                    this.props.resetScanResult();

                }, 2000);
            } else {
                this.setState({
                    onScan: this.props.onScan
                });
            }
        }

        if (this.props.scanResult !== prevProps.scanResult) {
            switch (this.props.scanResult) {
                case 'success':
                    bump();
                    this.setState({
                        theme: '#11e87d',
                        message: 'notify_verified'
                    });
                    break;
                case 'error':
                    this.setState({
                        theme: themeResolver('color-danger-600', this.props.theme),
                        message: 'notify_invalid'
                    });
                    break;
                case 'already':
                    this.setState({
                        theme: themeResolver('color-warning-400', this.props.theme),
                        message: 'notify_already'
                    });
                    break;
                default:
                    this.setState({
                        theme: themeResolver('color-basic-800', this.props.theme),
                        message: 'notify_scan'
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

    private handleQRCodeScanned(data: string): void {
        this.props.updateScanState(true);

        const timestamp: number = parseInt(data.substring(16, 32));
        const now: number = Math.floor(Date.now());
        const ticket_id: number = parseInt(data.substring(0, 16));
        const signature: string = data.substring(32);

        if (
            data.length !== 164
            || pad(timestamp.toString(), 16) !== data.substring(16, 32)
            || pad(ticket_id.toString(), 16) !== data.substring(0, 16)
            || signature.substring(0, 2) !== '0x'
            || timestamp > now
        ) {
            this.props.invalidQRCode();
            this.props.updateScanState(false);
            return;
        }

        if ((timestamp / 1000) < ((now / 1000) - 60)) {
            this.props.deprecatedQRCode();
            this.props.updateScanState(false);
            return;
        }

        this.props.verifiedTicket(timestamp, ticket_id, signature);
    }

    render(): React.ReactNode {
        const containerBackgroundColor = this.props.theme['color-basic-1000'];
        const { hasCameraPermission, onScan, theme, message }: TicketScannerScreenState = this.state;

        if (hasCameraPermission === null) {
            return <Text>{I18N.t('requesting_permission')}</Text>;
        }

        if (hasCameraPermission === false) {
            return <Text>{I18N.t('no_access')}</Text>;
        }
        
        return <View style={{height: '100%', backgroundColor: containerBackgroundColor}}>
            <CustomStatusBar containerBackgroundColor={theme} barStyle={'light-content'}/>
            <TopNavigation
                title={I18N.t('ticket_scanner_title')}
                titleStyle={{fontSize: 20, lineHeight: 20}}
                alignment={'center'}
                style={{backgroundColor: theme}}
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
                        ({data}: BarCodeEvent): void => this.handleQRCodeScanned(data)
                    }
                    style={StyleSheet.absoluteFillObject}
                />
                {
                    this.props.onScan
                    ?
                    <View
                        style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'rgba(10, 10, 10, 0.5)',
                            position: 'absolute',
                            justifyContent: 'center'
                        }}
                    >
                        <ActivityIndicator color={'white'}/>
                    </View>
                    :
                    null
                }
            </View>
            <View
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: screenHeight() * (1 / 5),
                    backgroundColor: theme
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 50,
                        paddingTop: 30,
                        fontWeight: '200'
                    }}
                >
                    {I18N.t(message)}
                </Text>
            </View>
        </View>;
    }
}

const mapStateToProps = (state: AppState): TicketScannerScreenRState => ({
    onScan: state.device.onScan,
    scanResult: state.device.scanResult
});

const mapDispatchToProps = (dispatch: Dispatch): TicketScannerScreenRDispatch => ({
    verifiedTicket: (timestamp: number, ticket_id: number, signature: string): void =>
        void dispatch(VerifyTicketQRCode(timestamp, ticket_id, signature)),
    updateScanState: (on: boolean): void =>
        void dispatch(UpdateScanState(on)),
    resetScanResult: (): void =>
        void dispatch(UpdateScanResult(null)),
    invalidQRCode: (): void => {
        dispatch(UpdateScanResult('error'));
        dispatch(AddMessage('invalid_qr', 'error'));
    },
    deprecatedQRCode: (): void => void dispatch(AddMessage('deprecated_qr', 'error'))
});

export default withStyles(
    connect(mapStateToProps, mapDispatchToProps)(
        TicketScannerScreen
    )
);
