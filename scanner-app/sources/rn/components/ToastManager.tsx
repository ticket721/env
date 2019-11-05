import * as React            from 'react';
import { AppState, Message } from '../../redux/state';
import { connect }           from 'react-redux';
import { Toast }             from '@ant-design/react-native';
import { I18N }              from '../../i18n';

export interface ToastManagerProps {

}

interface ToastManagerRState {
    message: Message;
}

type ToastManagerMergedProps = ToastManagerProps & ToastManagerRState;

class ToastManager extends React.Component<ToastManagerMergedProps> {

    componentWillUpdate(nextProps: Readonly<ToastManagerProps & ToastManagerRState>, nextState: Readonly<{}>, nextContext: any): void {

            switch (nextProps.message.message_type) {
                case 'error':
                    Toast.fail(I18N.t(nextProps.message.value), 1.5);
                    break;
                case 'success':
                    Toast.success(I18N.t(nextProps.message.value), 1.5);
                    break;
                default:
                    null;
            }
    }

    render = (): React.ReactNode =>
        this.props.children

}

const mapStateToProps = (state: AppState): ToastManagerRState => ({
    message: state.device.message
});

export default connect(mapStateToProps)(ToastManager);
