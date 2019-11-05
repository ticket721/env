import { Reducer }                                                                  from 'redux';
import { DeviceState, initialState }                                                from '../state';
import { StartAction, StatusActions, StatusActionsType }                            from '../actions/status';
import { ScannerCore }                                                              from '../../core/ScannerCore';
import {
    AddMessageAction,
    DeviceActions,
    DeviceActionsType,
    SetCurrentNetworkAction,
    SetCurrentEventAction,
    SetMessageHeightAction,
    SetNetworksAction,
    UpdateScanStateAction,
    UpdateScanResultAction
}                                                                                   from '../actions/device';
import { ScannerStorageRxDB }                                                       from '../../core/ScannerStorage/ScannerStorageRxDB';
import { plugin }                                                                   from 'rxdb';
import { ScannerStorage }                                                           from '../../core/ScannerStorage/ScannerStorage';
import { ScannerServerLink }                                                        from '../../core/ScannerServerLink/ScannerServerLink';
import { ScannerServerLinkStrapi }                                                  from '../../core/ScannerServerLink/ScannerServerLinkStrapi';
import { RefreshEventsAction, SetEventsAction, EventsActions, EventsActionsType }   from '../actions/events';
import { TicketProof }                                                              from '../../core/TicketProof/TicketProof';
import { TicketProofScanner }                                                       from '../../core/TicketProof/TicketProofScanner';

// tslint:disable-next-line
plugin(require('pouchdb-adapter-asyncstorage'));

const StatusStartReducer: Reducer<DeviceState, StartAction> = (state: DeviceState, action: StartAction): DeviceState =>
    ({
        ...initialState.device,
        core: state.core || new ScannerCore(
            (): ScannerStorage => new ScannerStorageRxDB(),
            (): ScannerServerLink => new ScannerServerLinkStrapi(),
            (): TicketProof => new TicketProofScanner()
        )
    });

const DeviceAddMessageReducer: Reducer<DeviceState, AddMessageAction> = (state: DeviceState, action: AddMessageAction): DeviceState => ({
    ...state,
    message: {
        value: action.value,
        message_type: action.message_type
    }
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

const DeviceUpdateScanStateReducer: Reducer<DeviceState, UpdateScanStateAction> = (state: DeviceState, action: UpdateScanStateAction): DeviceState => ({
    ...state,
    onScan: action.on
});

const DeviceUpdateScanResultReducer: Reducer<DeviceState, UpdateScanResultAction> = (state: DeviceState, action: UpdateScanResultAction): DeviceState => ({
    ...state,
    scanResult: action.result
});

const EventsSetEventsReducer: Reducer<DeviceState, SetEventsAction> = (state: DeviceState, action: SetEventsAction): DeviceState => ({
    ...state,
    refreshing: false
});

const EventsRefreshEventsReducer: Reducer<DeviceState, RefreshEventsAction> = (state: DeviceState, action: RefreshEventsAction): DeviceState => ({
    ...state,
    refreshing: true
});

const DeviceSetCurrentEventReducer: Reducer<DeviceState, SetCurrentEventAction> = (state: DeviceState, action: SetCurrentEventAction): DeviceState => ({
    ...state,
    current_event: action.event_id
});

/**
 * Main Reducer of the Device Section
 *
 * @param state
 * @param action
 * @constructor
 */
export const DeviceReducer: Reducer<DeviceState, any> = (state: DeviceState = initialState.device, action: DeviceActionsType | StatusActionsType | EventsActionsType): DeviceState => {
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
        case DeviceActions.UpdateScanState:
            return DeviceUpdateScanStateReducer(state, action as UpdateScanStateAction);
        case DeviceActions.UpdateScanResult:
            return DeviceUpdateScanResultReducer(state, action as UpdateScanResultAction);
        case EventsActions.SetEvents:
            return EventsSetEventsReducer(state, action as SetEventsAction);
        case EventsActions.RefreshEvents:
            return EventsRefreshEventsReducer(state, action as RefreshEventsAction);
        case DeviceActions.SetCurrentEvent:
            return DeviceSetCurrentEventReducer(state, action as SetCurrentEventAction);
        default:
            return state;
    }
};
