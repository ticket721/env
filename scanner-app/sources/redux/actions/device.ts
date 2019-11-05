import { Action }       from 'redux';
import { NetworkInfos } from '../state';

export const DeviceActions = {
    AddNetwork: '@@scanner/device/addnetwork',
    RemoveNetwork: '@@scanner/device/removenetwork',
    SelectNetwork: '@@scanner/device/selectnetwork',
    SetCurrentNetwork: '@@scanner/device/setcurrentnetwork',
    SetNetworks: '@@scanner/device/setnetworks',
    PingServer: '@@scanner/device/pingserver',
    AddMessage: '@@scanner/device/addmessage',
    SetMessageHeight: '@@scanner/device/setmessageheight',
    UpdateScanState: '@@scanner/device/updatescannstate',
    UpdateScanResult: '@@scanner/device/updatescanresult',
    SetCurrentEvent: '@@scanner/device/setcurrentevent',
    ResetScanner: '@@scanner/device/resetscanner'
};

export interface AddNetworkAction extends Action<string> {
    strapi_url: string;
    eth_node_url: string;
    name: string;
}

export interface RemoveNetworkAction extends Action<string> {
    name: string;
}

export interface SelectNetworkAction extends Action<string> {
    name: string;
}

export interface SetCurrentNetworkAction extends Action<string> {
    name: string;
}

export interface SetNetworksAction extends Action<string> {
    networks: NetworkInfos[];
}

export interface PingServerAction extends Action <string> {
}

export interface AddMessageAction extends Action<string> {
    value: string;
    message_type: string;
}

export interface SetMessageHeightAction extends Action<string> {
    height: number;
}

export interface UpdateScanStateAction extends Action<string> {
    on: boolean;
}

export interface UpdateScanResultAction extends Action<string> {
    result: string;
}

export interface SetCurrentEventAction extends Action<string> {
    event_id: number;
}

export interface ResetScannerAction extends Action<string> {

}

export const AddNetwork = (name: string, strapi_url: string, eth_node_url: string): AddNetworkAction => ({
    type: DeviceActions.AddNetwork,
    strapi_url,
    eth_node_url,
    name
});

export const RemoveNetwork = (name: string): RemoveNetworkAction => ({
    type: DeviceActions.RemoveNetwork,
    name
});

export const SelectNetwork = (name: string): SelectNetworkAction => ({
    type: DeviceActions.SelectNetwork,
    name
});

export const SetCurrentNetwork = (name: string): SetCurrentNetworkAction => ({
    type: DeviceActions.SetCurrentNetwork,
    name
});

export const SetNetworks = (networks: NetworkInfos[]): SetNetworksAction => ({
    type: DeviceActions.SetNetworks,
    networks
});

export const PingServer = (): PingServerAction => ({
    type: DeviceActions.PingServer
});

export const AddMessage = (value: string, message_type: string): AddMessageAction => ({
    type: DeviceActions.AddMessage,
    value,
    message_type
});

export const SetMessageHeight = (height: number): SetMessageHeightAction => ({
    type: DeviceActions.SetMessageHeight,
    height
});

export const UpdateScanState = (on: boolean): UpdateScanStateAction => ({
    type: DeviceActions.UpdateScanState,
    on
});

export const UpdateScanResult = (result: string): UpdateScanResultAction => ({
    type: DeviceActions.UpdateScanResult,
    result
});

export const SetCurrentEvent = (event_id: number): SetCurrentEventAction => ({
    type: DeviceActions.SetCurrentEvent,
    event_id
});

export const ResetScanner = (): ResetScannerAction => ({
    type: DeviceActions.ResetScanner
});

export type DeviceActionsType =
    AddNetworkAction
    | RemoveNetworkAction
    | SelectNetworkAction
    | SetNetworksAction
    | PingServerAction
    | AddMessageAction
    | SetMessageHeightAction
    | UpdateScanStateAction
    | UpdateScanResultAction
    | SetCurrentEventAction
    | ResetScannerAction;
