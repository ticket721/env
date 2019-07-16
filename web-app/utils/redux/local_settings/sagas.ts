import { SagaIterator }                       from 'redux-saga';
import { AppActions, IStart, Ready }          from '../app/actions';
import { call, put, takeEvery }               from 'redux-saga/effects';
import * as DeviceInfoGetter                  from 'device-detect';
import { AppModuleReady, ClientInformations } from '../app_state';
import { SetBrowserInfos }                    from './actions';
import { onClient }                           from '../../misc/onClient';

/**
 * When App starts, fetched device informations and sets it into the store
 *
 * @param action
 */
function* onAppStart(action: IStart): SagaIterator {
    let infos: ClientInformations;

    try {
        infos = yield call(onClient(DeviceInfoGetter));
    } catch (e) {
        infos = {
            browser: 'Chrome',
            device: 'Macintosh'
        };
    }

    yield put(SetBrowserInfos(infos, 'light'));
    yield put(Ready(AppModuleReady.LocalSettings));
}

export function* LocalSettingsSaga(): SagaIterator {
    yield takeEvery(AppActions.Start, onAppStart);
}
