import * as React              from 'react';
import { AppGateStatuses }     from './AppGateStatuses';
import { AppState, AppStatus } from '@utils/redux/app_state';
import { GateProps }           from '@components/gate/Gate';
import {
    AppCannotReachServerPath,
    AppInvalidRemoteConfigPath,
    AppLoadingPath,
    AppMissingStrapiUrlPath,
    AppReadyPath, AppRxDbCreateErrorPath
}                              from './AppGatePaths';
import { FullPageLoader }      from '@web_components/loaders/FullPageLoader';
import dynamic                 from 'next-server/dynamic';
import { GatesErrors }         from '../../web_views/message/gates_errors';
import { connect }             from 'react-redux';

// Dynamic Components

const Gate: React.ComponentType<GateProps> = dynamic<GateProps>(async () => import('@components/gate/Gate'), {
    loading: (): React.ReactElement => null
});

// Props

export interface AppGateProps {

}

interface AppGateRState {
    app_status: AppStatus;
}

interface AppGateState {
}

type MergedAppGateProps = AppGateProps & AppGateRState;

/**
 * Used to display loading, error or app depending on current `app_status`.
 */
class AppGate extends React.Component<MergedAppGateProps, AppGateState> {

    render(): React.ReactNode {

        return (
            <Gate status={this.props.app_status} statuses={AppGateStatuses}>
                <AppLoadingPath>
                    <FullPageLoader
                        message={'app_loading'}
                    />
                </AppLoadingPath>

                <AppReadyPath>
                    {this.props.children}
                </AppReadyPath>

                <AppCannotReachServerPath>
                    <GatesErrors message={'app_cannot_reach_server'}/>
                </AppCannotReachServerPath>

                <AppRxDbCreateErrorPath>
                    <GatesErrors message={'app_rxdb_error'}/>
                </AppRxDbCreateErrorPath>

                <AppInvalidRemoteConfigPath>
                    <GatesErrors message={'app_invalid_remote_config'}/>
                </AppInvalidRemoteConfigPath>

                <AppMissingStrapiUrlPath>
                    <GatesErrors message={'app_missing_strapi_url'}/>
                </AppMissingStrapiUrlPath>
            </Gate>
        );

    }
}

const mapStateToProps = (state: AppState): AppGateRState => ({
    app_status: state.app.status
});

export default connect(mapStateToProps)(AppGate);
