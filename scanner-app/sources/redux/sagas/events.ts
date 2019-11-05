import { ForkEffect, takeEvery, select, put }                                 from 'redux-saga/effects';
import { AppState, Event }                                                    from '../state';
import {
    EventsActions,
    SetEvents,
    SetEventsAction,
    AddEventAction,
    RemoveEventAction,
    GetEventInfosAction,
    AddEvent,
    RefreshEventsAction
}                                                                             from '../actions/events';
import { AddMessage, UpdateScanState }                                        from '../actions/device';

function* GetEventInfosSaga(action: GetEventInfosAction): IterableIterator<any> {
    const state: AppState = yield select();

    const idx = state.events.findIndex((event: Event): boolean => event.address === action.event_address);

    if (idx === -1) {
        try {
            const event_infos = yield state.device.core.getEventInfos(action.event_address);
            
            yield put(AddEvent(event_infos));
        } catch (e) {
            yield put(UpdateScanState(false));
            yield put(AddMessage('invalid_event_id', 'error'));
        }
    } else {
        yield put(UpdateScanState(false));
        yield put(AddMessage('already_added', 'error'));
    }
}

function* AddEventSaga(action: AddEventAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        yield state.device.core.addEvent(action.event_infos);

        yield put(UpdateScanState(false));
        yield put(AddMessage('event_added', 'success'));
        const events = yield state.device.core.getEvents(state.device.current_network);

        yield put(SetEvents(events));
    } catch (e) {
        yield put(UpdateScanState(false));
        yield put(AddMessage('invalid_event_added', 'error'));
    }
}

function* RemoveEventSaga(action: RemoveEventAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        yield state.device.core.removeEvent(action.event_id);

        const events = yield state.device.core.getEvents(state.device.current_network);

        yield put(SetEvents(events));
    } catch (e) {
        yield put(AddMessage('invalid_event_removed', 'error'));
    }
}

function* RefreshEventsSaga(action: RefreshEventsAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        const refreshEvents = yield state.device.core.refreshEvents();

        yield put(SetEvents(refreshEvents));
    } catch (e) {
        yield put(AddMessage('unable_to_refresh_event', 'error'));
    }
}

function* SetEventsSaga(action: SetEventsAction): IterableIterator<any> {
    const state: AppState = yield select();

    yield state.device.core.setEvents(action.events);
}

export function* EventsSagas(): IterableIterator<ForkEffect> {
    yield takeEvery(EventsActions.GetEventInfos, GetEventInfosSaga);
    yield takeEvery(EventsActions.AddEvent, AddEventSaga);
    yield takeEvery(EventsActions.RemoveEvent, RemoveEventSaga);
    yield takeEvery(EventsActions.RefreshEvents, RefreshEventsSaga);
    yield takeEvery(EventsActions.SetEvents, SetEventsSaga);
}
