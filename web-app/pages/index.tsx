import React           from 'react';
import dynamic                          from 'next/dynamic';
import { AppState, ClientInformations } from '../utils/redux/app_state';
import { connect }                      from 'react-redux';
import { SupportComingSoon }            from '../web_views/message/support_coming_soon';
import { FullPageLoader }               from '../web_components/loaders/FullPageLoader';
import { device_type }                  from '../utils/misc/device_type';
import { HomeViewProps }                from '../web_views/home_view';

const AppGate: React.ComponentType = dynamic<any>(async () => import('@web_components/appgate/AppGate'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const AuthGate: React.ComponentType = dynamic<any>(async () => import('@web_components/authgate/AuthGate'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const LocalWalletGate: React.ComponentType = dynamic<any>(async () => import('@web_components/localwalletgate/LocalWalletGate'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const VtxGate: React.ComponentType = dynamic<any>(async () => import('@web_components/vtxgate/VtxGate'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const NavBar: React.ComponentType<any> = dynamic<any>(async () => import('@web_components/navbar'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

const ProviderGate: React.ComponentType = dynamic<any>(async () => import('@web_components/providergate/ProviderGate'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const HomeView: React.ComponentType<HomeViewProps> = dynamic<HomeViewProps>(async () => import('@web_views/home_view'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

interface HomePageRState {
    device: ClientInformations;
}

type MergedHomePageProps = HomePageRState;

class HomePage extends React.Component<MergedHomePageProps> {

    render(): React.ReactNode {
        const device = device_type(this.props.device);

        switch (device) {
            case null:
                return <FullPageLoader/>;
            case 'mobile':
                return <div style={{width: '100%', height: '100%'}}>
                    <SupportComingSoon/>
                </div>;
            case 'desktop':
                return (
                    <NavBar>
                        <AppGate>
                            <ProviderGate>
                                <AuthGate>
                                    <LocalWalletGate>
                                        <VtxGate>
                                            <HomeView/>
                                        </VtxGate>
                                    </LocalWalletGate>
                                </AuthGate>
                            </ProviderGate>
                        </AppGate>
                    </NavBar>
                );
        }
    }
}

const mapStateToProps = (state: AppState): HomePageRState => ({
    device: state.local_settings.device
});

export default connect(mapStateToProps)(HomePage);
