import { Reducer }                                                             from 'redux';
import { InitialAppState, RemoteSettingsSection }                              from '../app_state';
import { ISetRemoteConfigs, RemoteSettingsActions, RemoteSettingsActionTypes } from './actions';

const SetRemoteConfigsReducer: Reducer<RemoteSettingsSection, ISetRemoteConfigs> =
    (state: RemoteSettingsSection, action: ISetRemoteConfigs): RemoteSettingsSection => ({
        ...state,
        node_host: action.node_host,
        node_port: action.node_port,
        node_connection_protocol: action.node_connection_protocol,
        contracts: action.contracts
    });

export const RemoteSettingsReducer: Reducer<RemoteSettingsSection, RemoteSettingsActionTypes> =
    (state: RemoteSettingsSection = InitialAppState.remote_settings, action: RemoteSettingsActionTypes): RemoteSettingsSection => {
        switch (action.type) {
            case RemoteSettingsActions.SetRemoteConfigs:
                return SetRemoteConfigsReducer(state, action as ISetRemoteConfigs);
            default:
                return state;
        }
    };
