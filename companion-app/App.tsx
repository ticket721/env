import * as Font                    from 'expo-font';
import * as React                   from 'react';
import Main                         from './sources/main';
import { Provider }                 from 'react-redux';
import { store }                    from './sources/redux/store';
import { Start }                    from './sources/redux/actions/status';
import { ApplicationProvider }      from 'react-native-ui-kitten';
import { t721dark }                 from './sources/theme';
import * as t721mapping             from './sources/theme/mapping.json';
import { Provider as AntdProvider } from '@ant-design/react-native';
import { LoadingScreen }            from './sources/rn/pages/loading_screen';
import ToastManager                 from './sources/rn/components/ToastManager';

const rstore = store();

interface AppComponentState {
    isReady: boolean;
}

export default class App extends React.Component<any, AppComponentState> {

    state: AppComponentState = {
        isReady: false
    };

    constructor(props: any) {
        super(props);
    }

    async componentDidMount(): Promise<void> {
        await Font.loadAsync(
            'antoutline',
            // eslint-disable-next-line
            require('@ant-design/icons-react-native/fonts/antoutline.ttf')
        );

        await Font.loadAsync(
            'antfill',
            // eslint-disable-next-line
            require('@ant-design/icons-react-native/fonts/antfill.ttf')
        );
        // eslint-disable-next-line
        rstore.dispatch(Start());
        this.setState({isReady: true});
    }

    render(): React.ReactNode {
        if (!this.state.isReady) {
            return (
                <Provider store={rstore}>
                    <LoadingScreen/>
                </Provider>
            );
        }
        return (
            <Provider store={rstore}>
                <ApplicationProvider mapping={t721mapping} theme={t721dark}>
                    <AntdProvider>
                        <ToastManager>
                            <Main/>
                        </ToastManager>
                    </AntdProvider>
                </ApplicationProvider>
            </Provider>
        );
    }
}
