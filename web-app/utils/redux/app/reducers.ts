import { Reducer }                                                                   from 'redux';
import { AppModuleReady, AppSection, AppStatus, InitialAppState, LocalWalletStatus } from '../app_state';
import {
    AppActions,
    AppActionTypes,
    IConfig,
    IReady,
    ISetAuthStatus,
    ISetLocalWallet,
    ISetStrapi,
    ISetToken, ISetUserInfos,
    ISetWalletProvider,
    IStatus,
    IUnlockedLocalWallet,
    IUnlockingLocalWallet
} from './actions';
import { VtxeventsActions }                                                          from 'ethvtx/lib/vtxevents/actions/actionTypes';

const UnlockedLocalWalletReducer: Reducer<AppSection, IUnlockedLocalWallet> =
    (state: AppSection, action: IUnlockedLocalWallet): AppSection => ({
        ...state,
        t721_wallet: {
            ...state.t721_wallet,
            private_key: action.unlocked_wallet,
            status: LocalWalletStatus.Unlocked,
            period: action.period
        }
    });

const UnlockingLocalWalletReducer: Reducer<AppSection, IUnlockingLocalWallet> =
    (state: AppSection, action: IUnlockingLocalWallet): AppSection => ({
        ...state,
        t721_wallet: {
            ...state.t721_wallet,
            status: state.t721_wallet.status === LocalWalletStatus.Unlocking ? LocalWalletStatus.Locked : LocalWalletStatus.Unlocking
        }
    });

const SetLocalWalletReducer: Reducer<AppSection, ISetLocalWallet> =
    (state: AppSection, action: ISetLocalWallet): AppSection => {

        if (action.encrypted_wallet === null) {
            return {
                ...state,
                t721_wallet: {
                    status: LocalWalletStatus.NotCreated,
                    private_key: null,
                    period: null,
                    address: null
                }
            };
        }

        if (action.encrypted_wallet === undefined) {
            return {
                ...state,
                t721_wallet: {
                    status: LocalWalletStatus.None,
                    private_key: undefined,
                    period: null,
                    address: null
                }
            };
        }

        return {
            ...state,
            t721_wallet: {
                status: LocalWalletStatus.Locked,
                private_key: action.encrypted_wallet,
                period: null,
                address: '0x' + (action.encrypted_wallet as any).address
            }
        };
    };

const SetTokenReducer: Reducer<AppSection, ISetToken> =
    (state: AppSection, action: ISetToken): AppSection => ({
        ...state,
        token: action.token
    });

const SetAuthStatusReducer: Reducer<AppSection, ISetAuthStatus> =
    (state: AppSection, action: ISetAuthStatus): AppSection => ({
        ...state,
        auth_process_status: action.status
    });

const SetWalletProviderReducer: Reducer<AppSection, ISetWalletProvider> =
    (state: AppSection, action: ISetWalletProvider): AppSection => ({
        ...state,
        provider: action.provider
    });

const ConfigReducer: Reducer<AppSection, IConfig> =
    (state: AppSection, action: IConfig): AppSection => ({
        ...state,
        config: {
            ...state.config,
            ...action.config
        }
    });

const SetStrapiReducer: Reducer<AppSection, ISetStrapi> =
    (state: AppSection, action: ISetStrapi): AppSection => ({
        ...state,
        strapi: action.strapi
    });

const StatusReducer: Reducer<AppSection, IStatus> =
    (state: AppSection, action: IStatus): AppSection => ({
        ...state,
        status: action.status
    });

const ReadyReducer: Reducer<AppSection, IReady> =
    (state: AppSection, action: IReady): AppSection => {

        let new_state;

        switch (action.module) {
            case AppModuleReady.RemoteSettings:
                new_state = {
                    ...state,
                    ready: {
                        ...state.ready,
                        remote_settings: true
                    }
                };

                break;
            case AppModuleReady.LocalSettings:
                new_state = {
                    ...state,
                    ready: {
                        ...state.ready,
                        local_settings: true
                    }
                };

                break;
            case AppModuleReady.App:
                new_state = {
                    ...state,
                    ready: {
                        ...state.ready,
                        app: true
                    }
                };

                break;
        }

        if (new_state.ready.local_settings
            && new_state.ready.remote_settings
            && new_state.ready.app) {
            new_state.status = AppStatus.Ready;
        }

        return new_state;

    };

const SetUserInfosReducer: Reducer<AppSection, ISetUserInfos> =
    (state: AppSection, action: ISetUserInfos): AppSection => ({
        ...state,
        user_infos: {
            firstName: action.firstName,
            lastName: action.lastName
        }
    });

export const AppReducer: Reducer<AppSection, AppActionTypes> =
    (state: AppSection = InitialAppState.app, action: AppActionTypes): AppSection => {

        switch (action.type) {
            case AppActions.Ready:
                return ReadyReducer(state, action as IReady);
            case AppActions.Status:
                return StatusReducer(state, action as IStatus);
            case AppActions.SetStrapi:
                return SetStrapiReducer(state, action as ISetStrapi);
            case AppActions.Config:
                return ConfigReducer(state, action as IConfig);
            case AppActions.SetWalletProvider:
                return SetWalletProviderReducer(state, action as ISetWalletProvider);
            case AppActions.SetAuthStatus:
                return SetAuthStatusReducer(state, action as ISetAuthStatus);
            case AppActions.SetToken:
                return SetTokenReducer(state, action as ISetToken);
            case AppActions.SetLocalWallet:
                return SetLocalWalletReducer(state, action as ISetLocalWallet);
            case AppActions.UnlockingLocalWallet:
                return UnlockingLocalWalletReducer(state, action as IUnlockingLocalWallet);
            case AppActions.UnlockedLocalWallet:
                return UnlockedLocalWalletReducer(state, action as IUnlockedLocalWallet);
            case AppActions.SetUserInfos:
                return SetUserInfosReducer(state, action as ISetUserInfos);
            default:
                return state;
        }

    };
