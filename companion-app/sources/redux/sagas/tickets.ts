import { ForkEffect, takeEvery, select, put }                                 from 'redux-saga/effects';
import { AppState }                                                           from '../state';
import { RefreshTicketsAction, SetTickets, SetTicketsAction, TicketsActions } from '../actions/tickets';
import { AddMessage }                                                         from '../actions/device';
import { ServerState }                                                        from '../../core/CompanionServerLink/CompanionServerLink';
import { DeviceReady }                                                        from '../actions/status';

function* SetTicketsSaga(action: SetTicketsAction): IterableIterator<any> {
    const state: AppState = yield select();
    yield state.device.core.setTickets(action.owner, action.tickets);
    if (action.owner === null) {
        yield put(DeviceReady());
    }
}

function* RefreshTicketsSaga(action: RefreshTicketsAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        const remote_state: ServerState = yield state.device.core.getState();

        yield put(SetTickets(remote_state.linked_to, remote_state.tickets));

    } catch {
        yield put(AddMessage('cannot reach server', 'error'));
        yield put(SetTickets(state.device.current_network, state.tickets));
    }

}

export function* TicketsSagas(): IterableIterator<ForkEffect> {
    yield takeEvery(TicketsActions.SetTickets, SetTicketsSaga);
    yield takeEvery(TicketsActions.RefreshTickets, RefreshTicketsSaga);
}
