import { ForkEffect, put, select, takeEvery }       from 'redux-saga/effects';
import {
    DeviceReady,
    LoadingNetwork,
    NoSuitableNetwork,
    Start,
    StatusActions
}                                                   from '../actions/status';
import { AppState, NetworkInfos, Ticket, Event }    from '../state';
import { log }                                      from '../../core/log';
import {
    AddMessage,
    AddNetworkAction,
    DeviceActions,
    RemoveNetworkAction,
    SelectNetworkAction,
    SetCurrentNetwork,
    SetNetworks,
    SetCurrentEventAction,
    UpdateScanState,
    UpdateScanResult
}                                                   from '../actions/device';
import {
    VerifyTicketQRCodeAction,
    AddVerifiedTicket,
    TicketActions,
    SetVerifiedTicketList
}                                                   from '../actions/tickets';
import { SetEvents }                                from '../actions/events';

function* LoadingRxDBSaga(): IterableIterator<any> {
    const state: AppState = yield select();
    yield state.device.core.setupStorage(null);

    log.info('[sagas/device.ts] started rxdb database');

    yield put(LoadingNetwork());
}

function* LoadingNetworkSaga(): IterableIterator<any> {
    const state: AppState = yield select();

    if (yield state.device.core.setupNetwork()) {
        log.info('[sagas/device.ts] loaded network');

        const networks: NetworkInfos[] = yield state.device.core.getNetworks();
        const selected_network: string = yield state.device.core.getSelectedNetwork();
        yield put(SetNetworks(networks));
        yield put(SetCurrentNetwork(selected_network));
        yield put(DeviceReady());
    } else {
        log.info('[sagas/device.ts] no suitable network found');
        const networks: NetworkInfos[] = yield state.device.core.getNetworks();
        yield put(SetNetworks(networks));
        yield put(NoSuitableNetwork());
    }

}

function* AddNetworkSaga(action: AddNetworkAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        yield state.device.core.addNetwork(action.name, action.eth_node_url, action.strapi_url);
        const nets = yield state.device.core.getNetworks();
        yield put(SetNetworks(nets));
    } catch (e) {
        yield put(AddMessage('invalid_network_added', 'error'));
    }
}

function* RemoveNetworkSaga(action: RemoveNetworkAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        yield state.device.core.removeNetwork(action.name);

        const nets = yield state.device.core.getNetworks();
        yield put(SetNetworks(nets));

        const selected_net: string = yield state.device.core.getSelectedNetwork();

        if (selected_net !== state.device.current_network) {
            yield put(SetCurrentNetwork(selected_net));
        }

    } catch (e) {
        yield put(AddMessage('invalid_network_deleted', 'error'));
    }
}

function* SelectNetworkSaga(action: SelectNetworkAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        yield state.device.core.setNetwork(action.name);
        yield put(SetCurrentNetwork(action.name));
        yield put(Start());
    } catch (e) {
        yield put(AddMessage('invalid_network_selected', 'error'));
    }
}

function* DeviceReadySaga(): IterableIterator<any> {
    log.info('[sagas/device.ts] device ready');
    const state: AppState = yield select();

    const net_idx = state.device.network_list.findIndex((net: NetworkInfos): boolean => net.name === state.device.current_network);

    if (net_idx === -1) {
        yield put(Start());
        return;
    }

    const current_events: Event[] = yield state.device.core.getSavedEvents();

    if (current_events.length === 1 && current_events[0] === null) {
        yield put(SetEvents([]));
    } else {
        yield put(SetEvents(current_events));

    }
}

function* PingServerSaga(): IterableIterator<any> {
    const state: AppState = yield select();

    const pingResponse = yield state.device.core.pingServer();

    if (!pingResponse) {
        yield put(NoSuitableNetwork());
    }
}

function* SetCurrentEventSaga(action: SetCurrentEventAction): IterableIterator<any> {
    const state: AppState = yield select();

    const tickets = yield state.device.core.getVerifiedTickets(action.event_id);

    yield put(SetVerifiedTicketList(tickets));
}

function* VerifyTicketQRCodeSaga(action: VerifyTicketQRCodeAction): IterableIterator<any> {
    const state: AppState = yield select();

    try {
        const owner = yield state.device.core.checkOwnedTicket(action.timestamp, state.device.current_event, action.ticket_id, action.signature);

        if (owner === 'unrelated_event') {
            yield put(AddMessage('unrelated_event', 'error'));
        } else {
            const idx = state.verified_tickets.findIndex((ticket: Ticket): boolean => ticket.ticket_id === action.ticket_id);
    
            if (idx === -1) {
                yield put(UpdateScanResult('success'));
                yield put(AddVerifiedTicket(owner, action.ticket_id, action.timestamp));
            } else {
                yield put(UpdateScanResult('already'));
            }
        }
    } catch (e) {
        yield put(UpdateScanResult('error'));
        yield put(AddMessage('invalid_ticket', 'error'));
        return null;
    }

    yield put(UpdateScanState(false));
}

function* ResetScannerSaga(): IterableIterator<any> {
    const state: AppState = yield select();

    yield state.device.core.clearStorage();
    yield put(Start());
}

export function* DeviceSagas(): IterableIterator<ForkEffect> {
    yield takeEvery(StatusActions.LoadingRxDB, LoadingRxDBSaga);
    yield takeEvery(StatusActions.LoadingNetwork, LoadingNetworkSaga);
    yield takeEvery(DeviceActions.AddNetwork, AddNetworkSaga);
    yield takeEvery(DeviceActions.RemoveNetwork, RemoveNetworkSaga);
    yield takeEvery(DeviceActions.SelectNetwork, SelectNetworkSaga);
    yield takeEvery(DeviceActions.PingServer, PingServerSaga);
    yield takeEvery(DeviceActions.SetCurrentEvent, SetCurrentEventSaga);
    yield takeEvery(TicketActions.VerifyTicketQRCode, VerifyTicketQRCodeSaga);
    yield takeEvery(StatusActions.DeviceReady, DeviceReadySaga);
    yield takeEvery(DeviceActions.ResetScanner, ResetScannerSaga);
}
