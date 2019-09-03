import { ForkEffect, takeEvery, select, put }       from 'redux-saga/effects';
import { ImagesActions, LoadImageAction, SetImage } from '../actions/images';
import { AppState }                                 from '../state';

function* LoadImageSaga(action: LoadImageAction): IterableIterator<any> {
    const state: AppState = yield select();

    const img = yield state.device.core.getImage(action.hash, action.url);

    yield put(SetImage(img, action.hash));
}

export function* ImagesSagas(): IterableIterator<ForkEffect> {
    yield takeEvery(ImagesActions.LoadImage, LoadImageSaga);
}
