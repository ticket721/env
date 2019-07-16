import { SagaIterator }                                            from 'redux-saga';
import { AppActions, IReady, Ready, SetWalletProvider, Status }    from '../app/actions';
import { call, put, select, takeEvery }                            from 'redux-saga/effects';
import { AppModuleReady, AppState, AppStatus, WalletProviderType } from '../app_state';
import Strapi                                                      from 'strapi-sdk-javascript';
import { SetRemoteConfigs }                                        from './actions';
import { VtxconfigSetAllowedNet }                                  from 'ethvtx/lib/vtxconfig/actions/actions';

/**
 * Waits for App section to be ready to use strapi to fetch remote settings, and sets them into the store
 *
 * @param action
 */
function* onAppSectionReady(action: IReady): SagaIterator {
    if (action.module === AppModuleReady.App) {

        const state: AppState = yield select();

        const strapi: Strapi = state.app.strapi;

        try {
            const remote_configs = yield call(strapi.getEntries.bind(strapi), 'networks');
            if (remote_configs.length === 0) {
                yield put(SetWalletProvider(WalletProviderType.None));
                return yield put(Status(AppStatus.InvalidRemoteConfigs));
            }
            const remote_config = remote_configs[0];
            yield put(SetRemoteConfigs(
                remote_config.node_host,
                remote_config.node_port,
                remote_config.node_connection_protocol,
                remote_config.contracts
            ));
            for (const network of remote_configs) {
                yield put(VtxconfigSetAllowedNet(network.net_id, network.genesis_block_hash));
            }
        } catch (e) {
            yield put(SetWalletProvider(WalletProviderType.None));
            return yield put(Status(AppStatus.CannotReachServer));
        }

        yield put(Ready(AppModuleReady.RemoteSettings));
    }
}

export function* RemoteSettingsSaga(): SagaIterator {
    yield takeEvery(AppActions.Ready, onAppSectionReady);
}
