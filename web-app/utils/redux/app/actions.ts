import { Action }                                                               from 'redux';
import { AppConfig, AppModuleReady, AppStatus, AuthStatus, WalletProviderType } from '../app_state';
import Strapi                                                                   from 'strapi-sdk-javascript';
import { Wallet }                                                               from 'ethereumjs-wallet';

export const AppActions = {
    Start: '[APP] START',
    Ready: '[APP] READY',
    Status: '[APP] STATUS',
    Config: '[APP] CONFIG',
    SetStrapi: '[APP] SET_STRAPI',
    SetWalletProvider: '[APP] SET_WALLET_PROVIDER',
    StartVortex: '[APP] START_VORTEX',
    Auth: '[APP] AUTH',
    Register: '[APP] REGISTER',
    SetAuthStatus: '[APP] SET_AUTH_STATUS',
    SetToken: '[APP] SET_TOKEN',
    SubmitEncryptedWallet: '[APP] SUBMIT_ENCRYPTED_WALLET',
    SetLocalWallet: '[APP] SET_LOCAL_WALLET',
    FetchLocalWallet: '[APP] FETCH_LOCAL_WALLET',
    ResetLocalWallet: '[APP] RESET_LOCAL_WALLET',
    UnlockingLocalWallet: '[APP] UNLOCKING_LOCAL_WALLET',
    UnlockedLocalWallet: '[APP] UNLOCKED_LOCAL_WALLET',
    SetUserInfos: '[APP] SET_USER_INFOS',
    UpdateUserInfos: '[APP] UPDATE_USER_INFOS'
};

export interface IUpdateUserInfos extends Action<string> {
    firstName: string;
    lastName: string;
}

export const UpdateUserInfos = (firstName: string, lastName: string): IUpdateUserInfos => ({
    type: AppActions.UpdateUserInfos,
    firstName,
    lastName
});

export interface ISetUserInfos extends Action<string> {
    firstName: string;
    lastName: string;
}

export const SetUserInfos = (firstName: string, lastName: string): ISetUserInfos => ({
    type: AppActions.SetUserInfos,
    firstName,
    lastName
});

export interface ISubmitEncryptedWallet extends Action<string> {
    encrypted_wallet: string;
}

/**
 * Submits an encrypted wallet generated on client side to the server.
 *
 * @param encrypted_wallet
 * @constructor
 */
export const SubmitEncryptedWallet = (encrypted_wallet: string): ISubmitEncryptedWallet => ({
    type: AppActions.SubmitEncryptedWallet,
    encrypted_wallet
});

export interface ISetLocalWallet extends Action<string> {
    encrypted_wallet: string;
}

/**
 * Set the encrypted V3 form of the wallet into the store
 *
 * @param encrypted_wallet
 * @constructor
 */
export const SetLocalWallet = (encrypted_wallet: string): ISetLocalWallet => ({
    type: AppActions.SetLocalWallet,
    encrypted_wallet
});

export interface IUnlockedLocalWallet extends Action<string> {
    unlocked_wallet: Wallet;
    period: number;
}

/**
 * Ends the process of unlocking the local wallet
 *
 * @param unlocked_wallet
 * @param period
 * @constructor
 */
export const UnlockedLocalWallet = (unlocked_wallet: Wallet, period: number): IUnlockedLocalWallet => ({
    type: AppActions.UnlockedLocalWallet,
    unlocked_wallet,
    period
});

export interface IUnlockingLocalWallet extends Action<string> {
}

/**
 * Starts the process of unlocking the local wallet
 *
 * @constructor
 */
export const UnlockingLocalWallet = (): IUnlockingLocalWallet => ({
    type: AppActions.UnlockingLocalWallet
});

export interface IFetchLocalWallet extends Action<string> {
}

/**
 * Fetches the local wall in its encrypted form from the server
 *
 * @constructor
 */
export const FetchLocalWallet = (): IFetchLocalWallet => ({
    type: AppActions.FetchLocalWallet,
});

export interface IResetLocalWallet extends Action<string> {
}

/**
 * Resets the local wallet
 *
 * @constructor
 */
export const ResetLocalWallet = (): IResetLocalWallet => ({
    type: AppActions.ResetLocalWallet,
});

export interface ISetToken extends Action<string> {
    token: string;
    remember: boolean;
}

/**
 * Sets the token used for authentication
 *
 * @param token
 * @param remember
 * @constructor
 */
export const SetToken = (token: string, remember: boolean): ISetToken => ({
    type: AppActions.SetToken,
    token,
    remember
});

export interface IAuth extends Action<string> {
    username: string;
    password: string;
    remember: boolean;
}

/**
 * Triggers an auth call to the server from the sagas
 *
 * @param username
 * @param password
 * @param remember
 * @constructor
 */
export const Auth = (username: string, password: string, remember: boolean): IAuth => ({
    type: AppActions.Auth,
    username,
    password,
    remember
});

export interface IRegister extends Action<string> {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}

/**
 * Triggers a register call to the server from the sagas
 *
 * @param username
 * @param password
 * @param email
 * @param firstName
 * @param lastName
 * @constructor
 */
export const Register = (username: string, password: string, email: string, firstName: string, lastName: string): IRegister => ({
    type: AppActions.Register,
    username,
    password,
    email,
    firstName,
    lastName
});

export interface ISetAuthStatus extends Action<string> {
    status: AuthStatus;
}

/**
 * Auth Status represents the current status of the user auth with the t721 api
 *
 * @param status
 * @constructor
 */
export const SetAuthStatus = (status: AuthStatus): ISetAuthStatus => ({
    type: AppActions.SetAuthStatus,
    status
});

export interface IStartVortex extends Action<string> {
}

/**
 * ethvtx is started
 *
 * @constructor
 */
export const StartVortex = (): IStartVortex => ({
    type: AppActions.StartVortex
});

export interface IStart extends Action<string> {
}

/**
 * App is started
 *
 * @constructor
 */
export const Start = (): IStart => ({
    type: AppActions.Start,
});

export interface IReady extends Action<string> {
    module: AppModuleReady;
}

/**
 * App is ready
 *
 * @param module
 * @constructor
 */
export const Ready = (module: AppModuleReady): IReady => ({
    type: AppActions.Ready,
    module
});

export interface IStatus extends Action<string> {
    status: AppStatus;
}

/**
 * Sets the status of the application
 *
 * @param status
 * @constructor
 */
export const Status = (status: AppStatus): IStatus => ({
    type: AppActions.Status,
    status
});

export interface ISetStrapi extends Action<string> {
    strapi: Strapi;
}

/**
 * Set the strapi instance into the store.
 *
 * @param strapi
 * @constructor
 */
export const SetStrapi = (strapi: Strapi): ISetStrapi => ({
    type: AppActions.SetStrapi,
    strapi
});

export interface IConfig extends Action<string> {
    config: AppConfig;
}

/**
 * Accepts and saves the required configuration for the app to properly work
 *
 * @param config
 * @constructor
 */
export const Config = (config: AppConfig): IConfig => ({
    type: AppActions.Config,
    config
});

export interface ISetWalletProvider extends Action<string> {
    provider: WalletProviderType;
}

/**
 * Sets the wallet provider. The saga saves this value into the browser storage. Setting it to None is like a disconnection.
 *
 * @param provider
 * @constructor
 */
export const SetWalletProvider = (provider: WalletProviderType): ISetWalletProvider => ({
    type: AppActions.SetWalletProvider,
    provider
});

export type AppActionTypes =
    IStart
    | IReady
    | IStatus
    | IConfig
    | ISetStrapi
    | ISetWalletProvider
    | IAuth
    | IRegister
    | ISetAuthStatus
    | ISetToken
    | ISetLocalWallet
    | IUnlockedLocalWallet
    | IUnlockingLocalWallet
    | ISubmitEncryptedWallet;
