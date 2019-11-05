import { ForkEffect, put, select, takeEvery }   from 'redux-saga/effects';
import {
    AddVerifiedTicketAction,
    RemoveVerifiedTicketAction,
    SetVerifiedTicketListAction,
    SetVerifiedTicketList,
    TicketActions,
}                                               from '../actions/tickets';
import { AppState, Ticket }                     from '../state';
import { AddMessage }                           from '../actions/device';

function* AddVerifiedTicketSaga(action: AddVerifiedTicketAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        const ticket_infos: Ticket = {
            ticket_id: action.ticket_id,
            owner: action.owner,
            timestamp: action.timestamp
        };
    
        yield state.device.core.addVerifiedTicket(state.device.current_event, ticket_infos);

        const verified_tickets = yield state.device.core.getVerifiedTickets(state.device.current_event);

        yield put(SetVerifiedTicketList(verified_tickets));
    } catch (e) {
        yield put(AddMessage('invalid_verified_ticket_added', 'error'));
    }
}

function* RemoveVerifiedTicketSaga(action: RemoveVerifiedTicketAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        yield state.device.core.removeVerifiedTicket(state.device.current_event, action.ticket_id);

        const verified_tickets = yield state.device.core.getVerifiedTickets(state.device.current_event);

        yield put(SetVerifiedTicketList(verified_tickets));
    } catch (e) {
        yield put(AddMessage('invalid_ticket_removed', 'error'));
    }
}

function* UpdateVerifiedTicketListSaga(action: SetVerifiedTicketListAction): IterableIterator<any> {
    const state: AppState = yield select();
    yield state.device.core.updateVerifiedTickets(state.device.current_event, action.tickets);

    const tickets = yield state.device.core.getVerifiedTickets(state.device.current_event);

    yield put(SetVerifiedTicketList(tickets));
}

export function* VerifiedTicketsSagas(): IterableIterator<ForkEffect> {
    yield takeEvery(TicketActions.AddVerifiedTicket, AddVerifiedTicketSaga);
    yield takeEvery(TicketActions.RemoveVerifiedTicket, RemoveVerifiedTicketSaga);
    yield takeEvery(TicketActions.UpdateVerifiedTicketList, UpdateVerifiedTicketListSaga);
}
