import * as React                                             from 'react';
import { GateProps }                                          from '@components/gate/Gate';
import { LocalWalletGateStatuses }                            from './LocalWalletGateStatuses';
import { LWCreatedPath, LWNotCreatedPath, LWNotRequiredPath } from './LocalWalletGatePaths';
import { AppState, LocalWallet, WalletProviderType }          from '@utils/redux/app_state';
import LocalWalletCreationView                                from '@web_views/local_wallet_creation_view';
import LWUnlock                                               from '../modals/lwunlock';
import LWAttempts                                             from '../modals/lwattempts';
import { FullPageLoader }                                     from '@web_components/loaders/FullPageLoader';
import dynamic                                                from 'next/dynamic';
import { FullDiv }                                            from '@components/html/FullDiv';
import { connect }                                            from 'react-redux';

// Dynamic Components

const Gate: React.ComponentType<GateProps> = dynamic<GateProps>(async () => import('@components/gate/Gate'), {
    loading: (): React.ReactElement => null
});

// Props

export interface LocalWalletProps {

}

interface LocalWalletGateRState {
    provider: WalletProviderType;
    wallet: LocalWallet;
}

export interface LocalWalletGateState {

}

type MergedLocalWalletProps = LocalWalletProps & LocalWalletGateRState;

/**
 * Used to render a creation view if the current provider is T721Provider AND that the stored private key is null (meaning that the user has no encrypted wallet on the server)
 */
class LocalWalletGate extends React.Component<MergedLocalWalletProps, LocalWalletGateState> {
    render(): React.ReactNode {

        let status = 0;

        if (this.props.provider !== WalletProviderType.T721Provider) {
            status = 2;
        } else if (this.props.wallet.private_key === undefined) {
            return <FullPageLoader/>;
        } else if (this.props.wallet.private_key !== null) {
            status = 1;
        }

        return <Gate status={status} statuses={LocalWalletGateStatuses}>
            <LWNotCreatedPath>
                <LocalWalletCreationView/>
            </LWNotCreatedPath>
            <LWCreatedPath>
                <FullDiv>
                    {this.props.children}
                    <LWUnlock/>
                    <LWAttempts/>
                </FullDiv>
            </LWCreatedPath>
            <LWNotRequiredPath>
                {this.props.children}
            </LWNotRequiredPath>
        </Gate>;
    }
}

const mapStateToProps = (state: AppState): LocalWalletGateRState => ({
    provider: state.app.provider,
    wallet: state.app.t721_wallet
});

export default connect(mapStateToProps)(LocalWalletGate);
