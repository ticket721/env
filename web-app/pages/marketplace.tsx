import React                                              from 'react';
import dynamic                          from 'next/dynamic';
import { isValidAddress }               from 'ethereumjs-util';
import { InvalidAddress }               from '../web_views/message/invalid_address';
import { MarketplaceViewProps }         from '../web_views/marketplace_view';
import {
    StrapiCoinbaseConsumer,
    StrapiCoinbaseContext,
    StrapiCoinbaseProvider
}                                       from '../components/context/StrapiCoinbase';
import { AppState, ClientInformations } from '../utils/redux/app_state';
import { connect }                      from 'react-redux';
import { SupportComingSoon }            from '../web_views/message/support_coming_soon';
import { FullPageLoader }               from '../web_components/loaders/FullPageLoader';
import { device_type }                  from '../utils/misc/device_type';

const AppGate: React.ComponentType = dynamic<any>(async () => import('@web_components/appgate/AppGate'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

const AuthGate: React.ComponentType = dynamic<any>(async () => import('@web_components/authgate/AuthGate'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

const LocalWalletGate: React.ComponentType = dynamic<any>(async () => import('@web_components/localwalletgate/LocalWalletGate'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

const VtxGate: React.ComponentType = dynamic<any>(async () => import('@web_components/vtxgate/VtxGate'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

const ProviderGate: React.ComponentType = dynamic<any>(async () => import('@web_components/providergate/ProviderGate'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

const NavBar: React.ComponentType<any> = dynamic<any>(async () => import('@web_components/navbar'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

const MarketplaceView: React.ComponentType<MarketplaceViewProps> = dynamic<MarketplaceViewProps>(async () => import('@web_views/marketplace_view'), {
    loading: (): React.ReactElement => null
});

interface MarketplacePageRState {
    device: ClientInformations;
}

class MarketplacePage extends React.Component<any> {
    static getInitialProps({query}: { query: any; }): any {
        return query;
    }

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

                if (this.props.address && !isValidAddress(this.props.address)) {
                    return <NavBar>
                        <InvalidAddress address={this.props.address}/>
                    </NavBar>;
                }

                return (
                    <NavBar>
                        <AppGate>
                            <ProviderGate>
                                <AuthGate>
                                    <LocalWalletGate>
                                        <VtxGate>
                                            <StrapiCoinbaseProvider>
                                                <StrapiCoinbaseConsumer>
                                                    {(ctx: StrapiCoinbaseContext): React.ReactNode =>
                                                        <MarketplaceView
                                                            coinbase={ctx.coinbase}
                                                        />
                                                    }
                                                </StrapiCoinbaseConsumer>
                                            </StrapiCoinbaseProvider>

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

const mapStateToProps = (state: AppState): MarketplacePageRState => ({
    device: state.local_settings.device
});

export default connect(mapStateToProps)(MarketplacePage);
