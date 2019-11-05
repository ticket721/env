import { Reducer }                                              from 'redux';
import { EventState, initialState }                             from '../state';
import { StartAction, StatusActions, StatusActionsType }        from '../actions/status';
import { SetEventsAction, EventsActions, EventsActionsType }    from '../actions/events';

const StatusStartReducer: Reducer<EventState, StartAction> = (state: EventState, action: StartAction): EventState =>
    initialState.events;

const EventsSetEventsReducer: Reducer<EventState, SetEventsAction> = (state: EventState, action: SetEventsAction): EventState => action.events;

/**
 * Main Reducer of the Event Section
 *
 * @param state
 * @param action
 * @constructor
 */
export const EventReducer: Reducer<EventState, any> = (state: EventState = initialState.events, action: EventsActionsType | StatusActionsType): EventState => {
    switch (action.type) {
        case StatusActions.Start:
            return StatusStartReducer(state, action);
        case EventsActions.SetEvents:
            return EventsSetEventsReducer(state, action as SetEventsAction);
        // case StatusActions.DeviceReady:
        //     return StatusDeviceReadyReducer(state, action as DeviceReadyAction);
        default:
            return state;
    }
};
