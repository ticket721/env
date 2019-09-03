import { call, ForkEffect, put, select, take, takeEvery } from 'redux-saga/effects';
import { END, eventChannel, EventChannel }                from 'redux-saga';
import {
    DeviceReady,
    DeviceReadyAction,
    LinkedAndReady,
    LoadingDeviceIdentifier,
    LoadingNetwork,
    LoadingWallet,
    NoSuitableNetwork,
    NotLinked,
    NotLinkedAction,
    Start,
    StatusActions
}                                                         from '../actions/status';
import { AppState, NetworkInfos, StatusState }            from '../state';
import { log }                                            from '../../core/log';
import {
    AddMessage,
    AddNetworkAction,
    DeviceActions,
    LoadCurrentQR,
    RemoveNetworkAction,
    SelectNetwork,
    SelectNetworkAction,
    SetCurrentNetwork,
    SetCurrentQR,
    SetDeviceID,
    SetLinkCode,
    SetNetworks
}                                                         from '../actions/device';
import { CompanionCore }                                  from '../../core/CompanionCore';
import { SetTickets }                                     from '../actions/tickets';
import { currentTimeRange }                               from '../../rn/utils/currentTimeRange';

let ivid = null;

function qr_code_channel(): EventChannel<any> {
    return eventChannel((emitter: (action: any) => void) => {

            ivid = setInterval(async () => {
                emitter(LoadCurrentQR());
            }, 100);

            return (): void => {
                clearInterval(ivid);
            };
        }
    );
}

function* LoadCurrentQRSaga(): IterableIterator<any> {
    const state: AppState = yield select();

    const current = currentTimeRange();
    if (state.device.current_ticket !== null && state.device.current_qr.timestamp !== current && state.status === StatusState.LinkedAndReady) {
        const proof = yield state.device.core.getTicketProof(state.device.current_ticket);
        const timestamp = proof[0];
        const signature = proof[1];

        yield put(SetCurrentQR(signature, state.device.current_ticket, timestamp));
    }

}

function* StartSaga(): IterableIterator<any> {
    const state: AppState = yield select();

    if (ivid === null) {
        const chan = yield call(qr_code_channel);
        try {
            while (true) {
                const event = yield take(chan);
                yield put(event);
            }
        } finally {
            chan.close();
            yield put(DeviceReady());
        }

    }
}

function* LoadingRxDBSaga(): IterableIterator<any> {
    const state: AppState = yield select();
    yield state.device.core.setupStorage(null);

    log.info('[sagas/device.ts] started rxdb database');

    yield put(LoadingWallet());
}

function* LoadingWalletSaga(): IterableIterator<any> {
    const state: AppState = yield select();
    yield state.device.core.setupWallet();

    log.info('[sagas/device.ts] loaded wallet');

    yield put(LoadingDeviceIdentifier());
}

function* LoadingDeviceIdentifierSaga(): IterableIterator<any> {
    const state: AppState = yield select();

    if (yield state.device.core.setupDeviceIdentifier()) {
        log.info('[sagas/device.ts] loaded device identifier');

        const device_identifier = yield state.device.core.getDeviceID();
        yield put(SetDeviceID(device_identifier));

        yield put(LoadingNetwork());
    } else {
        log.warn('[sagas/device.ts] error while loading identifier, resetting store');
        yield state.device.core.clearStorage();
        yield put(Start());
    }
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

        const selected_net = yield state.device.core.getSelectedNetwork();

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

function* DeviceReadySaga(action: DeviceReadyAction): IterableIterator<any> {
    log.info('[sagas/device.ts] device ready');
    const state: AppState = yield select();

    const net_idx = state.device.network_list.findIndex((net: NetworkInfos): boolean => net.name === state.device.current_network);

    if (net_idx === -1) {
        yield put(Start());
        return;
    }

    const current_saved_state = yield state.device.core.getSavedState();
    let current_state = null;

    if (current_saved_state.tickets.length === 1 && current_saved_state.tickets[0] === null) {
        // Initial setup

        current_state = yield state.device.core.getState();

    } else {
        // Already setup, no boot fetch

        current_state = current_saved_state;

    }

    if (current_state === null) {
        if (state.device.network_list[net_idx].linked_to !== null) {
            const tickets = yield state.device.core.getTickets(state.device.current_network);

            if (tickets.length === 1 && tickets[0] === null) {
                yield put(LinkedAndReady([]));
            } else {
                yield put(LinkedAndReady(tickets));
            }
            return;
        } else {
            yield put(NoSuitableNetwork());
            yield put(AddMessage('cannot_reach_network', 'error'));
            return;
        }
    }

    if (current_state.linked === false) {
        yield put(NotLinked());
    } else {
        yield put(SetTickets(current_state.linked_to, current_state.tickets));
        yield put(LinkedAndReady(current_state.tickets));
    }
}

function waitForLink(core: CompanionCore): EventChannel<any> {
    return eventChannel((emitter: (action: any) => void) => {

            let fetching = false;

            const iv = setInterval(async () => {
                if (!fetching) {
                    fetching = true;
                    try {
                        const state = await core.getState();
                        if (state && state.linked === true) {
                            return emitter(END);
                        }
                    } catch (e) {
                    }
                    fetching = false;
                }
            }, 5000);

            // The subscriber must return an unsubscribe function
            return (): void => {
                clearInterval(iv);
            };
        }
    );
}

function* NotLinkedSaga(action: NotLinkedAction): IterableIterator<any> {
    const state: AppState = yield select();
    const code = yield state.device.core.issueCode();

    if (code === null) {
        yield put(AddMessage('cannot_reach_selected_server', 'error'));
        yield put(SelectNetwork(null));
    }

    yield put(SetLinkCode(code));

    const chan = yield call(waitForLink, state.device.core);
    try {
        while (true) {
            yield take(chan);
        }
    } finally {
        chan.close();
        yield put(DeviceReady());
    }
}

function* ResetCompanionSaga(): IterableIterator<any> {
    const state: AppState = yield select();

    yield state.device.core.clearStorage();
    yield put(Start());
}

export function* DeviceSagas(): IterableIterator<ForkEffect> {
    yield takeEvery(StatusActions.LoadingRxDB, LoadingRxDBSaga);
    yield takeEvery(StatusActions.LoadingWallet, LoadingWalletSaga);
    yield takeEvery(StatusActions.LoadingDeviceIdentifier, LoadingDeviceIdentifierSaga);
    yield takeEvery(StatusActions.LoadingNetwork, LoadingNetworkSaga);
    yield takeEvery(DeviceActions.AddNetwork, AddNetworkSaga);
    yield takeEvery(DeviceActions.RemoveNetwork, RemoveNetworkSaga);
    yield takeEvery(DeviceActions.SelectNetwork, SelectNetworkSaga);
    yield takeEvery(StatusActions.DeviceReady, DeviceReadySaga);
    yield takeEvery(StatusActions.NotLinked, NotLinkedSaga);
    yield takeEvery(StatusActions.Start, StartSaga);
    yield takeEvery(DeviceActions.LoadCurrentQR, LoadCurrentQRSaga);
    yield takeEvery(DeviceActions.ResetCompanion, ResetCompanionSaga);
}
