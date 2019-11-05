import { Action } from 'redux';

export const StatusActions = {
    Start: '@@scanner/status/start',
    LoadingRxDB: '@@scanner/status/loadingrxdb',
    LoadingNetwork: '@@scanner/status/loadingnetwork',
    NoSuitableNetwork: '@@scanner/status/nosuitablenetwork',
    DeviceReady: '@@scanner/status/deviceready',
};

export interface StartAction extends Action<string> {
}

export interface LoadingRxDBAction extends Action<string> {
}

export interface LoadingNetworkAction extends Action<string> {
}

export interface NoSuitableNetworkAction extends Action<string> {
}

export interface DeviceReadyAction extends Action<string> {
}

export const Start = (): StartAction => ({
    type: StatusActions.Start
});

export const LoadingRxDB = (): LoadingRxDBAction => ({
    type: StatusActions.LoadingRxDB
});

export const LoadingNetwork = (): LoadingNetworkAction => ({
    type: StatusActions.LoadingNetwork
});

export const NoSuitableNetwork = (): NoSuitableNetworkAction => ({
    type: StatusActions.NoSuitableNetwork
});

export const DeviceReady = (): DeviceReadyAction => ({
    type: StatusActions.DeviceReady
});

export type StatusActionsType =
    StartAction
    | LoadingRxDBAction
    | LoadingNetworkAction
    | NoSuitableNetworkAction
    | DeviceReadyAction;
