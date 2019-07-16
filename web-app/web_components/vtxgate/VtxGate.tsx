import * as React                          from 'react';
import { VtxGateStatuses, VtxStatusNames } from './VtxGateStatuses';
import { GateProps }                       from '@components/gate/Gate';
import { FullPageLoader }                  from '@web_components/loaders/FullPageLoader';
import {
    VtxAuthorizingPath,
    VtxIdlePath,
    VtxLoadingPath,
    VtxErrorPath,
    VtxLoadedPath,
    VtxUnauthorizedPath,
    VtxWrongNetPath
}                                          from './VtxGatePaths';
import dynamic                             from 'next/dynamic';
import { GatesErrors }                     from '../../web_views/message/gates_errors';
import { AppState }                        from '../../utils/redux/app_state';
import { connect }                         from 'react-redux';

// Dynamic Components

const Gate: React.ComponentType<GateProps> = dynamic<GateProps>(async () => import('@components/gate/Gate'), {
    loading: (): React.ReactElement => null
});

// Props

export interface VtxGateProps {

}

interface VtxGateRState {
    vtx_status: string;
}

export interface VtxGateState {
}

type MergedVtxGateProps = VtxGateProps & VtxGateRState;

/**
 * Renders errors or loaders depending on ethvtx status.
 */
export class VtxGate extends React.Component<MergedVtxGateProps, VtxGateState> {

    render(): React.ReactNode {

        return (
            <Gate status={VtxStatusNames.indexOf(this.props.vtx_status)} statuses={VtxGateStatuses}>
                <VtxLoadingPath>
                    <FullPageLoader
                        message={'vtx_loading'}
                    />
                </VtxLoadingPath>

                <VtxAuthorizingPath>
                    <FullPageLoader
                        message={'vtx_authorizing'}
                    />
                </VtxAuthorizingPath>

                <VtxIdlePath>
                    <FullPageLoader
                        message={'vtx_idle'}
                    />
                </VtxIdlePath>

                <VtxErrorPath>
                    <GatesErrors message={'vtx_error'}/>
                </VtxErrorPath>

                <VtxLoadedPath>
                    {this.props.children}
                </VtxLoadedPath>

                <VtxUnauthorizedPath>
                    <GatesErrors message={'vtx_unauthorized'}/>
                </VtxUnauthorizedPath>

                <VtxWrongNetPath>
                    <GatesErrors message={'vtx_wrong_net'}/>
                </VtxWrongNetPath>
            </Gate>
        );

    }
}

const mapStateToProps = (state: AppState): VtxGateRState => ({
    vtx_status: state.vtxconfig.status
});

export default connect(mapStateToProps)(VtxGate);
