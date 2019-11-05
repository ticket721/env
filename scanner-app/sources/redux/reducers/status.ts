import { Reducer }                   from 'redux';
import { StatusState, initialState } from '../state';
import {
    NoSuitableNetworkAction,
    DeviceReadyAction,
    StartAction,
    StatusActions,
    StatusActionsType
}                                    from '../actions/status';

const StatusStartReducer: Reducer<StatusState, StartAction> = (state: StatusState, action: StartAction): StatusState =>
    initialState.status;

const StatusNoSuitableNetworkReducer: Reducer<StatusState, NoSuitableNetworkAction> = (state: StatusState, action: NoSuitableNetworkAction): StatusState => StatusState.BootNetworkChoice;

const StatusReadyReducer: Reducer<StatusState, DeviceReadyAction> = (state: StatusState, action: DeviceReadyAction): StatusState => StatusState.DeviceReady;

/**
 * Main Reducer of the Status Section
 *
 * @param state
 * @param action
 * @constructor
 */
export const StatusReducer: Reducer<StatusState, StatusActionsType> = (state: StatusState = initialState.status, action: StatusActionsType): StatusState => {
    switch (action.type) {
        case StatusActions.Start:
            return StatusStartReducer(state, action);
        case StatusActions.NoSuitableNetwork:
            return StatusNoSuitableNetworkReducer(state, action);
        case StatusActions.DeviceReady:
            return StatusReadyReducer(state, action as DeviceReadyAction);
        default:
            return state;
    }
};
