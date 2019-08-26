import * as React            from 'react';
import { AppState, Message } from '../../redux/state';
import { Dispatch }          from 'redux';
import { SetMessageHeight }  from '../../redux/actions/device';
import { connect }           from 'react-redux';
import { Toast }             from '@ant-design/react-native';
import { I18N }              from '../../i18n';

export interface ToastManagerProps {

}

interface ToastManagerRState {
    messages: Message[];
    current_height: number;
}

interface ToastManagerRDispatch {
    setHeight: (height: number) => void;
}

type ToastManagerMergedProps = ToastManagerProps & ToastManagerRState & ToastManagerRDispatch;

class ToastManager extends React.Component<ToastManagerMergedProps> {

    componentWillUpdate(nextProps: Readonly<ToastManagerProps & ToastManagerRState & ToastManagerRDispatch>, nextState: Readonly<{}>, nextContext: any): void {
        if (nextProps.current_height < nextProps.messages.length) {
            const message = nextProps.messages[nextProps.current_height];

            switch (message.message_type) {
                case 'error':
                    Toast.fail(I18N.t(message.value));
            }

            nextProps.setHeight(nextProps.current_height + 1);
        }
    }

    render = (): React.ReactNode =>
        this.props.children

}

const mapStateToProps = (state: AppState): ToastManagerRState => ({
    messages: state.device.messages,
    current_height: state.device.shown_messages
});

const mapDispatchToProps = (dispatch: Dispatch): ToastManagerRDispatch => ({
    setHeight: (height: number): void => void SetMessageHeight(height)
});

export default connect(mapStateToProps, mapDispatchToProps)(ToastManager);
