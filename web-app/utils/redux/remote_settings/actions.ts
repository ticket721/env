import { Action }         from 'redux';
import { ContractsStore } from '../app_state';

export const RemoteSettingsActions = {
    SetRemoteConfigs: '[REMOTE_SETTINGS] SET_REMOTE_CONFIGS'
};

export interface ISetRemoteConfigs extends Action<string> {
    node_host: string;
    node_port: number;
    node_connection_protocol: string;
    contracts: ContractsStore;
}

/**
 * Saved remote informations into the store
 *
 * @param node_host
 * @param node_port
 * @param node_connection_protocol
 * @param contracts
 * @constructor
 */
export const SetRemoteConfigs = (node_host: string, node_port: number, node_connection_protocol: string, contracts: ContractsStore): ISetRemoteConfigs => ({
    type: RemoteSettingsActions.SetRemoteConfigs,
    node_host,
    node_port,
    node_connection_protocol,
    contracts
});

export type RemoteSettingsActionTypes = ISetRemoteConfigs;
