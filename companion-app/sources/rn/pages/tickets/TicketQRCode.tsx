import * as React                              from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import QRCode                                  from 'react-native-qrcode-svg';
import { ThemedComponentProps, withStyles }    from 'react-native-ui-kitten';
import * as Brightness                         from 'expo-brightness';
import { AppState }                            from '../../../redux/state';
import { connect }                             from 'react-redux';
import { pad }                                 from '../../utils/pad';
import { CompanionCore }                       from '../../../core/CompanionCore';

export interface TicketQRCodeProps {
    ticket_id: number;
}

interface TicketQRCodeRState {
    qr: {
        source: string;
        ticket: number;
        timestamp: number;
    };
    core: CompanionCore;
}

type TicketQRCodeMergedProps = ThemedComponentProps & TicketQRCodeProps & TicketQRCodeRState;

class TicketQRCode extends React.Component<TicketQRCodeMergedProps> {

    original_brightness: number = null;

    async componentDidMount(): Promise<void> {
        this.original_brightness = await Brightness.getBrightnessAsync();
        await Brightness.setBrightnessAsync(1);
    }

    async componentWillUnmount(): Promise<void> {
        await Brightness.setBrightnessAsync(this.original_brightness || 0.5);
    }

    render(): React.ReactNode {

        const size = Math.floor(Dimensions.get('window').width * 0.98);

        let content = null;

        if (this.props.qr && this.props.qr.ticket === this.props.ticket_id) {
            content = `${pad(this.props.qr.ticket.toString(), 16)}${pad(this.props.qr.timestamp.toString(), 16)}${this.props.qr.source}`;
        }

        return <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: size - 10,
                height: size - 10,
                borderRadius: 6
            }}
        >
            {
                content

                    ?
                    <QRCode
                        value={content}
                        backgroundColor={'transparent'}
                        color={'white'}
                        size={size - 10}
                    />
                    :
                    <ActivityIndicator/>
            }
        </View>;

    }
}

const mapStateToProps = (state: AppState): TicketQRCodeRState => ({
    qr: state.device.current_qr,
    core: state.device.core
});

export default withStyles(
    connect(mapStateToProps)(
        TicketQRCode
    )
) as React.ComponentType<TicketQRCodeProps>;
