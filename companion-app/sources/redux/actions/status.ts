import { Action } from 'redux';
import { Ticket } from '../state';

export const StatusActions = {
    Start: '@@companion/status/start',
    LoadingRxDB: '@@companion/status/loadingrxdb',
    LoadingWallet: '@@companion/status/loadingwallet',
    LoadingDeviceIdentifier: '@@companion/status/loadingdeviceidentifier',
    LoadingNetwork: '@@companion/status/loadingnetwork',
    NoSuitableNetwork: '@@companion/status/nosuitablenetwork',
    DeviceReady: '@@companion/status/deviceready',
    NotLinked: '@@companion/status/notlinked',
    LinkedAndReady: '@@companion/status/linkedandready'
};

export interface StartAction extends Action<string> {
}

export interface LoadingRxDBAction extends Action<string> {
}

export interface LoadingWalletAction extends Action<string> {
}

export interface LoadingDeviceIdentifierAction extends Action<string> {
}

export interface LoadingNetworkAction extends Action<string> {
}

export interface NoSuitableNetworkAction extends Action<string> {
}

export interface DeviceReadyAction extends Action<string> {
}

export interface NotLinkedAction extends Action<string> {
}

export interface LinkedAndReadyAction extends Action<string> {
    tickets: Ticket[];
}

export const Start = (): StartAction => ({
    type: StatusActions.Start
});

export const LoadingRxDB = (): LoadingRxDBAction => ({
    type: StatusActions.LoadingRxDB
});

export const LoadingWallet = (): LoadingWalletAction => ({
    type: StatusActions.LoadingWallet
});

export const LoadingDeviceIdentifier = (): LoadingDeviceIdentifierAction => ({
    type: StatusActions.LoadingDeviceIdentifier
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

export const NotLinked = (): NotLinkedAction => ({
    type: StatusActions.NotLinked
});

export const LinkedAndReady = (tickets: Ticket[]): LinkedAndReadyAction => ({
    type: StatusActions.LinkedAndReady,
    tickets
});

export type StatusActionsType =
    StartAction
    | LoadingRxDBAction
    | LoadingWalletAction
    | LoadingDeviceIdentifierAction
    | LoadingNetworkAction
    | NoSuitableNetworkAction
    | DeviceReadyAction
    | NotLinkedAction
    | LinkedAndReadyAction;
