import { SagaIterator }                                          from 'redux-saga';
import { IVtxconfigResetComplete, VtxconfigActions, VtxpollAdd } from 'ethvtx/lib/actions';
import { put, takeEvery }                                        from 'redux-saga/effects';
import { data_fetcher, height_fetcher }                          from './polls';

function* onVtxReady(action: IVtxconfigResetComplete): SagaIterator {
    yield put(VtxpollAdd('strapi_height_fetcher', height_fetcher.interval, height_fetcher.poll));
    yield put(VtxpollAdd('strapi_data_fetcher', data_fetcher.interval, data_fetcher.poll));
}

export function* StrapiCacheSaga(): SagaIterator {
    yield takeEvery(VtxconfigActions.VtxconfigResetComplete, onVtxReady);
}
