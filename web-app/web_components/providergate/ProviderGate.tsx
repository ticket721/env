import * as React                       from 'react';
import { AppState, WalletProviderType } from '@utils/redux/app_state';
import { GateProps }                    from '@components/gate/Gate';
import {
    WalletProviderInjectedProviderPath,
    WalletProviderNonePath,
    WalletProviderT721ProviderPath
}                                       from './ProviderGatePaths';
import { ProviderGateStatuses }         from './ProviderGateStatuses';
import ProviderSelectionView            from '@web_views/provider_selection_view';
import { FullPageLoader }               from '../loaders/FullPageLoader';
import dynamic                          from 'next/dynamic';
import { connect }                      from 'react-redux';

// Dynamic Component

const Gate: React.ComponentType<GateProps> = dynamic<GateProps>(async () => import('@components/gate/Gate'), {
    loading: (): React.ReactElement => null
});

// Props

export interface ProviderGateProps {

}

interface ProviderGateRState {
    provider_status: WalletProviderType;
}

export interface ProviderGateState {

}

type MergedProviderGateProps = ProviderGateProps & ProviderGateRState;

/**
 * Renders the Provider selection view if no provider selected.
 */
class ProviderGate extends React.Component<MergedProviderGateProps, ProviderGateState> {

    render(): React.ReactNode {

        if (this.props.provider_status === null) return <FullPageLoader/>;

        return (
            <Gate status={this.props.provider_status} statuses={ProviderGateStatuses}>

                <WalletProviderNonePath>
                    <ProviderSelectionView/>
                </WalletProviderNonePath>

                <WalletProviderInjectedProviderPath>
                    {this.props.children}
                </WalletProviderInjectedProviderPath>

                <WalletProviderT721ProviderPath>
                    {this.props.children}
                </WalletProviderT721ProviderPath>

            </Gate>
        );

    }
}

const mapStateToProps = (state: AppState): ProviderGateRState => ({
    provider_status: state.app.provider
});

export default connect(mapStateToProps)(ProviderGate);
