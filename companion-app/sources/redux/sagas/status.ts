import { ForkEffect, takeEvery, put } from 'redux-saga/effects';
import { LoadingRxDB, StatusActions } from '../actions/status';
import { log }                        from '../../core/log';

export function* StartSaga(): IterableIterator<any> {
    log.info('[sagas/status.ts] starting application');
    yield put(LoadingRxDB());
}

export function* StatusSagas(): IterableIterator<ForkEffect> {
    yield takeEvery(StatusActions.Start, StartSaga);
}
