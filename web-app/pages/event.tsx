import React                            from 'react';
import dynamic                          from 'next/dynamic';
import {
    StrapiCoinbaseContext,
    StrapiCoinbaseConsumer,
    StrapiCoinbaseProvider
}                                       from '@components/context/StrapiCoinbase';
import { EventViewProps }               from '../web_views/event_view';
import { isValidAddress }               from 'ethereumjs-util';
import { InvalidAddress }               from '../web_views/message/invalid_address';
import { AppState, ClientInformations } from '../utils/redux/app_state';
import { connect }                      from 'react-redux';
import { SupportComingSoon }            from '../web_views/message/support_coming_soon';
import { FullPageLoader }               from '../web_components/loaders/FullPageLoader';
import { device_type }                  from '../utils/misc/device_type';

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

const ProviderGate: React.ComponentType = dynamic<any>(async () => import('@web_components/providergate/ProviderGate'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

const NavBar: React.ComponentType<any> = dynamic<any>(async () => import('@web_components/navbar'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

const EventView: React.ComponentType<EventViewProps> = dynamic<any>(async () => import('@web_views/event_view'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

interface EventPageProps {
    address: string;
}

interface EventPageRState {
    device: ClientInformations;
}

type MergedEventPageProps = EventPageProps & EventPageRState;

class EventPage extends React.Component<MergedEventPageProps> {

    static getInitialProps(arg: any): any {
        return {address: arg.query.address};
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
                return (
                    <NavBar>
                        <AppGate>
                            <ProviderGate>
                                <AuthGate>
                                    <LocalWalletGate>
                                        <VtxGate>
                                            <StrapiCoinbaseProvider>
                                                <StrapiCoinbaseConsumer>
                                                    {(ctx: StrapiCoinbaseContext): React.ReactNode => {

                                                        if (this.props.address && isValidAddress(this.props.address)) {
                                                            return <div
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    paddingLeft: '5%',
                                                                    paddingRight: '5%'
                                                                }}
                                                            >
                                                                <EventView
                                                                    coinbase={ctx.coinbase}
                                                                    address={this.props.address}
                                                                />
                                                            </div>;
                                                        } else {
                                                            return <div
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    paddingLeft: '5%',
                                                                    paddingRight: '5%'
                                                                }}
                                                            >
                                                                <InvalidAddress address={this.props.address}/>
                                                            </div>;
                                                        }

                                                    }}

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

const mapStateToProps = (state: AppState): EventPageRState => ({
    device: state.local_settings.device
});

export default connect(mapStateToProps)(EventPage);
