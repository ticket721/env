import { SagaIterator }                                                        from 'redux-saga';
import {
    AppActions,
    FetchLocalWallet,
    IAuth,
    IFetchLocalWallet,
    IReady,
    IRegister,
    ISetToken,
    ISetWalletProvider,
    IStart,
    IStartVortex,
    ISubmitEncryptedWallet, IUpdateUserInfos,
    Ready,
    SetAuthStatus,
    SetLocalWallet,
    SetStrapi,
    SetToken, SetUserInfos,
    SetWalletProvider,
    StartVortex,
    Status
} from './actions';
import { call, put, select, takeEvery }                                        from 'redux-saga/effects';
import { AppModuleReady, AppState, AppStatus, AuthStatus, WalletProviderType } from '../app_state';
import Strapi                                                                  from 'strapi-sdk-javascript';
import { RxDatabase }                                                          from 'rxdb';
import { getRxDB }                                                             from '../../rxdb';
import { ContractsAddSpec, ContractsNew, VtxconfigReset, VtxconfigSetWeb3 }    from 'ethvtx/lib/actions';
import Web3                                                                    from 'web3';
import { LWManager }                                                           from '../LWManager';
import { VtxconfigAuthorizeAndSetWeb3 }                                        from 'ethvtx/lib/vtxconfig/actions/actions';
import { RGA }                                                                 from '../../misc/ga';
import { fetch_height }                                                        from '../strapi_cache/polls';
import { StrapiCacheSetHeight }                                                from '../strapi_cache/actions';

/**
 * Called when the app starts. Builds Strapi and sets it in the store.
 *
 * @param action
 */
function* onAppStart(action: IStart): SagaIterator {

    const state: AppState = yield select();

    if (!state.app.config.strapi_endpoint) {
        return yield put(Status(AppStatus.MissingStrapiUrl));
    }

    let strapi;
    try {
        strapi = new Strapi(state.app.config.strapi_endpoint);
        const server_height = yield call(fetch_height, strapi);
        yield put(StrapiCacheSetHeight(server_height));
    } catch (e) {
        yield put(SetWalletProvider(WalletProviderType.None));
        return yield put(Status(AppStatus.CannotReachServer));
    }

    yield put(SetStrapi(strapi));
    yield put(Ready(AppModuleReady.App));

}

/**
 * When all sections are ready (App, Local Settings and Remote Settings), the sagas will start fetching local configurations
 *
 * @param action
 */
function* onAllSectionsReady(action: IReady): SagaIterator {

    const state: AppState = yield select();

    if (state.app.status === AppStatus.Ready) {

        const rxdb: RxDatabase = yield call(getRxDB);

        const config = yield rxdb.collections.config.find().exec();

        if (config.length === 0) {
            yield rxdb.collections.config.insert({
                wallet_provider: WalletProviderType.None
            });
            yield put(SetWalletProvider(WalletProviderType.None));
        } else {
            if (config[0].wallet_provider === WalletProviderType.InjectedProvider && global.window.web3 === undefined) {
                yield put(SetWalletProvider(WalletProviderType.None));
            } else {
                yield put(SetWalletProvider(config[0].wallet_provider));
            }
        }

    }

}

/**
 * When the wallet provider is set, the store restarts the ethvtx section or tries to fetch auth informations in the case of T721Provider
 *
 * @param action
 */
export function* onSetWalletProvider(action: ISetWalletProvider): SagaIterator {

    const rxdb: RxDatabase = yield call(getRxDB);

    let config;
    try {
        config = yield rxdb.collections.config.find().exec();
        if (config.length === 0) {
            yield rxdb.collections.config.insert({
                wallet_provider: action.provider
            });
            config = yield rxdb.collections.config.find().exec();
        }

        if (config[0].wallet_provider !== action.provider) {

            yield config[0].update({
                $set: {
                    wallet_provider: action.provider
                }
            });

        }
    } catch (e) {
        console.error('Store not ready to store config');
    }

    switch (action.provider) {
        case WalletProviderType.InjectedProvider: {
            RGA.event({
                category: 'User',
                action: 'Selected InjectedProvider'
            });
            yield put(StartVortex());
            break ;
        }
        case WalletProviderType.T721Provider: {
            const auth = yield rxdb.collections.auth.find().exec();

            if (auth.length !== 0) {
                yield put(SetToken(auth[0].token, true));
                yield put(FetchLocalWallet());
            } else {
                yield put(SetToken(null, false));
            }
            break;
        }
        case WalletProviderType.None: {
            yield put(SetAuthStatus(AuthStatus.None));
            yield put(SetToken(null, false));
            yield put(SetLocalWallet(undefined));
            yield put(VtxconfigSetWeb3(null));
            yield put(VtxconfigReset());
            break;
        }
    }
}

/**
 * Triggers ethvtx initialization process for every type of wallet provider
 *
 * @param action
 */
function* onStartVortex(action: IStartVortex): SagaIterator {

    const state: AppState = yield select();

    switch (state.app.provider) {
        case WalletProviderType.InjectedProvider: {

            if (global.window.ethereum) {

                const web3_getter = async (): Promise<any> => {
                    const provider = global.window.ethereum;

                    const web3 = new Web3(provider);

                    return web3;
                };

                let cb;

                const promise = new Promise<void>((ok: any, ko: any): void => {
                    cb = ok;
                });

                yield put(VtxconfigAuthorizeAndSetWeb3({
                    enable: global.window.ethereum.enable,
                    web3: web3_getter
                }, cb));

                yield call(async (): Promise<void> => promise);

            } else if (global.window.web3) {

                const browser_web3 = global.window.web3;
                const web3 = new Web3(browser_web3.currentProvider);

                yield put(VtxconfigSetWeb3(web3));

            }

            for (const contract of Object.keys(state.remote_settings.contracts)) {
                yield put(ContractsAddSpec(contract, JSON.parse(state.remote_settings.contracts[contract].abi), {
                    permanent: true,
                    bin: state.remote_settings.contracts[contract].runtime_binary
                }));
                yield put(ContractsNew(contract, state.remote_settings.contracts[contract].address, {
                    permanent: true,
                    alias: `@${contract.toLowerCase()}`
                }));
            }

            yield put(VtxconfigReset());

            break;
        }
        case WalletProviderType.T721Provider: {
            if (state.app.t721_wallet.private_key === null || state.app.t721_wallet.private_key === undefined) {
                return ;
            }

            const { node_host, node_port, node_connection_protocol }: any = state.remote_settings;
            let provider;

            switch (node_connection_protocol) {
                case 'http':
                case 'https':
                    provider = new Web3.providers.HttpProvider(`${node_connection_protocol}://${node_host}:${node_port}`);
                    break;
                default:
                    if (global.window.web3) {
                        provider = global.window.web3.currentProvider;
                    } else {
                        throw new Error(`Unknown connection protocol "${node_connection_protocol}" and no injected wallet found`);
                    }
            }

            const web3 = yield call(LWManager.buildWeb3, provider);

            yield put(VtxconfigSetWeb3(web3));

            for (const contract of Object.keys(state.remote_settings.contracts)) {
                yield put(ContractsAddSpec(contract, JSON.parse(state.remote_settings.contracts[contract].abi), {
                    permanent: true,
                    bin: state.remote_settings.contracts[contract].runtime_binary
                }));
                yield put(ContractsNew(contract, state.remote_settings.contracts[contract].address, {
                    permanent: true,
                    alias: `@${contract.toLowerCase()}`
                }));
            }

            yield put(VtxconfigReset());

            break;
        }
    }

}

/**
 * When requested, an auth request is made to the server and the resulting token is saved is the remember me flag was true
 *
 * @param action
 */
function* onAuth(action: IAuth): SagaIterator {
    const state: AppState = yield select();

    if (state.app.status === AppStatus.Ready) {

        const strapi: Strapi = state.app.strapi;

        yield put(SetAuthStatus(AuthStatus.AuthStarted));

        try {
            const token = yield call(strapi.login.bind(strapi), action.username, action.password);

            RGA.event({category: 'Login', action: 'Succesful Login'});
            yield put(SetAuthStatus(AuthStatus.None));
            yield put(SetToken(token.jwt, action.remember));
            yield put(FetchLocalWallet());

        } catch (e) {
            RGA.event({category: 'Login', action: 'Login Fail', value: 5});
            if (e.message.indexOf('Identifier or password invalid') !== -1) {
                return yield put(SetAuthStatus(AuthStatus.AuthInvalidIdentifierOrPassword));
            }
        }
    }
}

/**
 * When requested, a register request is made to the server and the resulting token is saved
 *
 * @param action
 */
function* onRegister(action: IRegister): SagaIterator {
    const state: AppState = yield select();

    if (state.app.status === AppStatus.Ready) {

        const strapi: Strapi = state.app.strapi;

        yield put(SetAuthStatus(AuthStatus.RegisterStarted));

        try {
            const token = (yield call(strapi.request.bind(strapi), 'post', `${state.app.config.strapi_endpoint}/auth/local/register`, {
                data: {
                    username: action.username,
                    email: action.email,
                    password: action.password,
                    firstName: action.firstName,
                    lastName: action.lastName
                }
            }));

            strapi.setToken(token.jwt);

            // TODO Validation link

            RGA.event({category: 'Register', action: 'Succesful Register'});
            yield put(SetAuthStatus(AuthStatus.None));
            yield put(SetToken(token.jwt, true));
            yield put(FetchLocalWallet());

        } catch (e) {
            RGA.event({category: 'Register', action: 'Register Fail', value: 5});
            if (e.message.indexOf('Email is already taken') !== -1) {
                return yield put(SetAuthStatus(AuthStatus.RegisterEmailAlreadyInUse));
            }
        }
    }
}

/**
 * When token is set, saves it to browser. If value is null, removes every trace of auth from the browser.
 *
 * @param action
 */
function* onSetToken(action: ISetToken): SagaIterator {
    if (action.token && action.remember) {

        const state: AppState = yield select();

        const rxdb: RxDatabase = yield call(getRxDB);

        const auth = yield rxdb.collections.auth.find().exec();

        if (auth.length === 0) {
            yield rxdb.collections.auth.insert({
                token: action.token
            });
        } else {
            auth[0].update({
                $set: {
                    token: action.token
                }
            });
        }

        state.app.strapi.setToken(action.token, true);

    } else if (action.token === null) {

        const rxdb: RxDatabase = yield call(getRxDB);

        yield rxdb.collections.auth.find().remove();

    }
}

/**
 * Fetches the encrypted user wallet
 *
 * @param action
 */
function* onFetchLocalWallet(action: IFetchLocalWallet): SagaIterator {
    const strapi: Strapi = (yield select()).app.strapi;

    try {
        const me = yield call(strapi.getEntry.bind(strapi), 'users', 'me');

        yield put(SetUserInfos(me.firstName, me.lastName));
        yield put(SetLocalWallet(me.encrypted_wallet));
        yield put(StartVortex());
    } catch (e) {
        yield put(SetWalletProvider(WalletProviderType.None));
        return yield put(Status(AppStatus.CannotReachServer));
    }
}

function *onUpdateUserInfos(action: IUpdateUserInfos): SagaIterator {
    const state: AppState = (yield select());
    const strapi: Strapi = state.app.strapi;
    const strapi_endpoint = state.app.config.strapi_endpoint;

    try {
        const new_user = yield call(strapi.request.bind(strapi), 'post', `${strapi_endpoint}/users/updateinfos`, {
            data: {
                firstName: action.firstName,
                lastName: action.lastName
            }
        });

        yield put(SetUserInfos(new_user.firstName, new_user.lastName));

    } catch (e) {
        yield put(SetWalletProvider(WalletProviderType.None));
        return yield put(Status(AppStatus.CannotReachServer));
    }
}

/**
 * Submits a new encrypted wallet to the server, for it to be recovered upon auth
 *
 * @param action
 */
function* onSubmitEncryptedWallet(action: ISubmitEncryptedWallet): SagaIterator {
    const state: AppState = (yield select());

    if (state.app.status === AppStatus.Ready && state.app.provider === WalletProviderType.T721Provider && state.app.token !== null) {
        const strapi: Strapi = state.app.strapi;

        try {
            yield call(strapi.request.bind(strapi), 'post', `${state.app.config.strapi_endpoint}/users/set-wallet`, {
                data: {
                    encrypted_wallet: action.encrypted_wallet
                }
            });
            RGA.event({
                category: 'User',
                action: 'Succesful T721 wallet upload'
            });
        } catch (e) {
            RGA.event({
                category: 'User',
                action: 'T721 wallet upload error',
                value: 5
            });
            console.error(e);
        }

        yield put(FetchLocalWallet());
    }
}

export function* AppSaga(): SagaIterator {
    yield takeEvery(AppActions.Start, onAppStart);
    yield takeEvery(AppActions.Ready, onAllSectionsReady);
    yield takeEvery(AppActions.SetWalletProvider, onSetWalletProvider);
    yield takeEvery(AppActions.StartVortex, onStartVortex);
    yield takeEvery(AppActions.Auth, onAuth);
    yield takeEvery(AppActions.Register, onRegister);
    yield takeEvery(AppActions.SetToken, onSetToken);
    yield takeEvery(AppActions.FetchLocalWallet, onFetchLocalWallet);
    yield takeEvery(AppActions.SubmitEncryptedWallet, onSubmitEncryptedWallet);
    yield takeEvery(AppActions.UpdateUserInfos, onUpdateUserInfos);
}
