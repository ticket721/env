import React                            from 'react';
import dynamic                          from 'next/dynamic';
import {
    StrapiCoinbaseContext,
    StrapiCoinbaseConsumer,
    StrapiCoinbaseProvider
}                                       from '@components/context/StrapiCoinbase';
import { AppState, ClientInformations } from '../utils/redux/app_state';
import { connect }                      from 'react-redux';
import { SupportComingSoon }            from '../web_views/message/support_coming_soon';
import { FullPageLoader }               from '../web_components/loaders/FullPageLoader';
import { device_type }                  from '../utils/misc/device_type';
import { TicketViewProps }              from '../web_views/ticket_view';

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

const TicketView: React.ComponentType<TicketViewProps> = dynamic<TicketViewProps>(async () => import('@web_views/ticket_view'), {
    loading: (): React.ReactElement => null,
    ssr: true
});

interface TicketPageProps {
    id: string;
}

interface TicketPageRState {
    device: ClientInformations;
}

type MergedEventPageProps = TicketPageProps & TicketPageRState;

class TicketPage extends React.Component<MergedEventPageProps> {

    static getInitialProps(arg: any): any {
        return {id: arg.query.id};
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

                                                        if (this.props.id !== undefined && this.props.id !== null) {
                                                            return <div
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%'
                                                                }}
                                                            >
                                                                <TicketView id={this.props.id} coinbase={ctx.coinbase}/>
                                                            </div>;
                                                        } else {
                                                            return <div
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%'
                                                                }}
                                                            >
                                                                <p>invalid ticket id</p>
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

const mapStateToProps = (state: AppState): TicketPageRState => ({
    device: state.local_settings.device
});

export default connect(mapStateToProps)(TicketPage);
