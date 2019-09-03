import { Action }       from 'redux';
import { NetworkInfos } from '../state';

export const DeviceActions = {
    AddNetwork: '@@companion/device/addnetwork',
    RemoveNetwork: '@@companion/device/removenetwork',
    SelectNetwork: '@@companion/device/selectnetwork',
    SetCurrentNetwork: '@@companion/device/setcurrentnetwork',
    SetNetworks: '@@companion/device/setnetworks',
    SetDeviceID: '@@companion/device/deviceid',
    AddMessage: '@@companion/device/addmessage',
    SetMessageHeight: '@@companion/device/setmessageheight',
    SetLinkCode: '@@companion/device/setlinkcode',
    LoadCurrentQR: '@@companion/device/loadcurrentqr',
    SetCurrentQR: '@@companion/device/setcurrentqr',
    SetCurrentTicket: '@@companion/device/setcurrentticket',
    ResetCompanion: '@@companion/device/resetcompanion'
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

export interface SetDeviceIDAction extends Action<string> {
    device_identifier: string;
}

export interface AddMessageAction extends Action<string> {
    value: string;
    message_type: string;
}

export interface SetMessageHeightAction extends Action<string> {
    height: number;
}

export interface SetLinkCodeAction extends Action<string> {
    code: string;
}

export interface LoadCurrentQRAction extends Action<string> {
}

export interface SetCurrentQRAction extends Action<string> {
    source: string;
    ticket_id: number;
    timestamp: number;
}

export interface SetCurrentTicketAction extends Action<string> {
    ticket_id: number;
}

export interface ResetCompanionAction extends Action<string> {

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

export const SetDeviceID = (device_identifier: string): SetDeviceIDAction => ({
    type: DeviceActions.SetDeviceID,
    device_identifier
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

export const SetLinkCode = (code: string): SetLinkCodeAction => ({
    type: DeviceActions.SetLinkCode,
    code
});

export const LoadCurrentQR = (): LoadCurrentQRAction => ({
    type: DeviceActions.LoadCurrentQR
});

export const SetCurrentQR = (source: string, ticket_id: number, timestamp: number): SetCurrentQRAction => ({
    type: DeviceActions.SetCurrentQR,
    source,
    ticket_id,
    timestamp
});

export const SetCurrentTicket = (ticket_id: number): SetCurrentTicketAction => ({
    type: DeviceActions.SetCurrentTicket,
    ticket_id
});

export const ResetCompanion = (): ResetCompanionAction => ({
    type: DeviceActions.ResetCompanion
});

export type DeviceActionsType =
    AddNetworkAction
    | RemoveNetworkAction
    | SelectNetworkAction
    | SetNetworksAction
    | SetDeviceIDAction
    | AddMessageAction
    | SetMessageHeightAction
    | SetLinkCodeAction
    | SetLinkedAccountAction
    | LoadCurrentQRAction
    | SetCurrentQRAction
    | SetCurrentTicketAction
    | ResetCompanionAction;
