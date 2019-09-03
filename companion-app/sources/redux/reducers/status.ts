import { Reducer }                   from 'redux';
import { StatusState, initialState } from '../state';
import {
    NoSuitableNetworkAction,
    NotLinkedAction,
    DeviceReadyAction,
    StartAction,
    StatusActions,
    StatusActionsType, LinkedAndReadyAction
}                                    from '../actions/status';

const StatusStartReducer: Reducer<StatusState, StartAction> = (state: StatusState, action: StartAction): StatusState =>
    initialState.status;

const StatusNoSuitableNetworkReducer: Reducer<StatusState, NoSuitableNetworkAction> = (state: StatusState, action: NoSuitableNetworkAction): StatusState => StatusState.BootNetworkChoice;

const StatusReadyReducer: Reducer<StatusState, DeviceReadyAction> = (state: StatusState, action: DeviceReadyAction): StatusState => StatusState.DeviceReady;

const StatusNotLinkedReducer: Reducer<StatusState, NotLinkedAction> = (state: StatusState, action: NotLinkedAction): StatusState => StatusState.NotLinked;

const StatusLinkedAndReadyReducer: Reducer<StatusState, LinkedAndReadyAction> = (state: StatusState, action: LinkedAndReadyAction): StatusState => StatusState.LinkedAndReady;

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
            return StatusReadyReducer(state, action);
        case StatusActions.NotLinked:
            return StatusNotLinkedReducer(state, action);
        case StatusActions.LinkedAndReady:
            return StatusLinkedAndReadyReducer(state, action as LinkedAndReadyAction);
        default:
            return state;
    }
};
