import { Reducer }                                                                    from 'redux';
import { DeviceState, initialState, NetworkInfos }                                    from '../state';
import { StartAction, StatusActions, StatusActionsType }                              from '../actions/status';
import { CompanionCore }                                                              from '../../core/CompanionCore';
import {
    AddMessageAction,
    DeviceActions,
    DeviceActionsType,
    SetCurrentNetworkAction, SetCurrentQRAction, SetCurrentTicketAction, SetLinkCodeAction,
    SetMessageHeightAction,
    SetNetworksAction
}                                                                                     from '../actions/device';
import { CompanionStorageRxDB }                                                       from '../../core/CompanionStorage/CompanionStorageRxDB';
import { plugin }                                                                     from 'rxdb';
import { CompanionIdentifierRetrieverExpo }                                           from '../../core/CompanionIdentifierRetriever/CompanionIdentifierRetrieverExpo';
import { CompanionWalletEthers }                                                      from '../../core/CompanionWallet/CompanionWalletEthers';
import { CompanionStorage }                                                           from '../../core/CompanionStorage/CompanionStorage';
import { CompanionIdentifierRetriever }                                               from '../../core/CompanionIdentifierRetriever/CompanionIdentifierRetriever';
import { CompanionWallet }                                                            from '../../core/CompanionWallet/CompanionWallet';
import { CompanionServerLink }                                                        from '../../core/CompanionServerLink/CompanionServerLink';
import { CompanionServerLinkStrapi }                                                  from '../../core/CompanionServerLink/CompanionServerLinkStrapi';
import { RefreshTicketsAction, SetTicketsAction, TicketsActions, TicketsActionsType } from '../actions/tickets';

// tslint:disable-next-line
plugin(require('pouchdb-adapter-asyncstorage'));

const StatusStartReducer: Reducer<DeviceState, StartAction> = (state: DeviceState, action: StartAction): DeviceState =>
    ({
        ...initialState.device,
        core: state.core || new CompanionCore(
            (): CompanionStorage => new CompanionStorageRxDB(),
            (): CompanionIdentifierRetriever => new CompanionIdentifierRetrieverExpo(),
            (): CompanionWallet => new CompanionWalletEthers(),
            (): CompanionServerLink => new CompanionServerLinkStrapi()
        )
    });

const DeviceAddMessageReducer: Reducer<DeviceState, AddMessageAction> = (state: DeviceState, action: AddMessageAction): DeviceState => ({
    ...state,
    messages: [
        ...state.messages,
        {
            value: action.value,
            message_type: action.message_type
        }
    ]
});

const DeviceSetMessageHeightReducer: Reducer<DeviceState, SetMessageHeightAction> = (state: DeviceState, action: SetMessageHeightAction): DeviceState => ({
    ...state,
    shown_messages: action.height
});

const DeviceSetNetworksReducer: Reducer<DeviceState, SetNetworksAction> = (state: DeviceState, action: SetNetworksAction): DeviceState => ({
    ...state,
    network_list: action.networks
});

const DeviceSetCurrentNetworkReducer: Reducer<DeviceState, SetCurrentNetworkAction> = (state: DeviceState, action: SetCurrentNetworkAction): DeviceState => ({
    ...state,
    current_network: action.name
});

const TicketsSetTicketsReducer: Reducer<DeviceState, SetTicketsAction> = (state: DeviceState, action: SetTicketsAction): DeviceState => ({
    ...state,
    refreshing: false
});

const TicketsRefreshTicketsReducer: Reducer<DeviceState, RefreshTicketsAction> = (state: DeviceState, action: RefreshTicketsAction): DeviceState => ({
    ...state,
    refreshing: true
});

const DeviceSetLinkCodeReducer: Reducer<DeviceState, SetLinkCodeAction> = (state: DeviceState, action: SetLinkCodeAction): DeviceState => {
    const net_idx = state.network_list.findIndex((net: NetworkInfos): boolean => net.name === state.current_network);
    if (net_idx === -1) return state;
    state.network_list[net_idx].link_code = action.code;

    return {
        ...state,
        network_list: [
            ...state.network_list
        ]
    };
};

const DeviceSetCurrentTicketReducer: Reducer<DeviceState, SetCurrentTicketAction> = (state: DeviceState, action: SetCurrentTicketAction): DeviceState => ({
    ...state,
    current_ticket: action.ticket_id
});

const DeviceSetCurrentQRReducer: Reducer<DeviceState, SetCurrentQRAction> = (state: DeviceState, action: SetCurrentQRAction): DeviceState => ({
    ...state,
    current_qr: {
        source: action.source,
        ticket: action.ticket_id,
        timestamp: action.timestamp
    }
});

/**
 * Main Reducer of the Device Section
 *
 * @param state
 * @param action
 * @constructor
 */
export const DeviceReducer: Reducer<DeviceState, any> = (state: DeviceState = initialState.device, action: DeviceActionsType | StatusActionsType | TicketsActionsType): DeviceState => {
    switch (action.type) {
        case StatusActions.Start:
            return StatusStartReducer(state, action as StartAction);
        case DeviceActions.SetNetworks:
            return DeviceSetNetworksReducer(state, action as SetNetworksAction);
        case DeviceActions.AddMessage:
            return DeviceAddMessageReducer(state, action as AddMessageAction);
        case DeviceActions.SetMessageHeight:
            return DeviceSetMessageHeightReducer(state, action as SetMessageHeightAction);
        case DeviceActions.SetCurrentNetwork:
            return DeviceSetCurrentNetworkReducer(state, action as SetCurrentNetworkAction);
        case DeviceActions.SetLinkCode:
            return DeviceSetLinkCodeReducer(state, action as SetLinkCodeAction);
        case TicketsActions.SetTickets:
            return TicketsSetTicketsReducer(state, action as SetTicketsAction);
        case TicketsActions.RefreshTickets:
            return TicketsRefreshTicketsReducer(state, action as RefreshTicketsAction);
        case DeviceActions.SetCurrentQR:
            return DeviceSetCurrentQRReducer(state, action as SetCurrentQRAction);
        case DeviceActions.SetCurrentTicket:
            return DeviceSetCurrentTicketReducer(state, action as SetCurrentTicketAction);
        default:
            return state;
    }
};
