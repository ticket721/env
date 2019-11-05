import { State } from 'ethvtx/lib/state';
import Strapi    from 'strapi-sdk-javascript';
import Tx        from 'ethereumjs-tx';

export interface StrapiCacheDataFragment {
    data: any;
}

export interface StrapiCacheErrorFragment {
    error: Error;
}

export interface StrapiCacheFragmentStore {
    [key: string]: (StrapiCacheDataFragment | StrapiCacheErrorFragment);
}

export interface StrapiCacheCallReturnFragment {
    hash: string;
    data: (StrapiCacheDataFragment | StrapiCacheErrorFragment);
}

export interface StrapiCacheCall {
    required: boolean;
    result: string[];
    height: number;
    call: () => Promise<StrapiCacheCallReturnFragment[]>;
}

export interface StrapiCacheCallStore {
    [key: string]: StrapiCacheCall;
}

export interface StrapiCacheSection {
    fragments: StrapiCacheFragmentStore;
    calls: StrapiCacheCallStore;
    height: number;
}

export interface AttemptHeader {
    type: string;
    id: number;
    validate: boolean;
    error: string;
}

export interface TxAttempt extends AttemptHeader {
    tx: Tx;
}

export interface TypedData {
    type: string;
    name: string;
    value: any;
}

export interface SignAttempt extends AttemptHeader {
    sign: TypedData[];
}

export type WalletAttempt = (TxAttempt | SignAttempt);

export interface LWTransactionsSection {
    attempts: WalletAttempt[];
}

export interface ClientInformations {
    browser: string;
    device: string;
}

export interface LocalSettingsSection {
    device: ClientInformations;
    theme: string;
}

export enum AppModuleReady {
    App = 0,
    LocalSettings,
    RemoteSettings
}

export interface AppReady {
    local_settings: boolean;
    remote_settings: boolean;
    app: boolean;
}

export enum AppStatus {
    Loading = 0,
    Ready,

    CannotReachServer,
    MissingStrapiUrl,
    RxDbCreateError,
    InvalidRemoteConfigs
}

export interface AppConfig {
    strapi_endpoint: string;
    google_api_token: string;
    tx_explorer: string;
}

export enum WalletProviderType {
    None = 0,
    InjectedProvider,
    T721Provider
}

export enum AuthStatus {
    None = 0,

    AuthStarted,
    AuthInvalidIdentifierOrPassword,

    RegisterStarted,
    RegisterEmailAlreadyInUse
}

export enum LocalWalletStatus {
    None = 0,
    NotCreated,
    Locked,
    Unlocked,
    Unlocking,
    Using
}

export interface LocalWallet {
    private_key: any;
    status: LocalWalletStatus;
    period: number;
    address: string;
}

export interface UserInfos {
    firstName: string;
    lastName: string;
}

export interface AppSection {
    ready: AppReady;
    status: AppStatus;
    provider: WalletProviderType;
    strapi: Strapi;
    config: AppConfig;
    token: string;
    t721_wallet: LocalWallet;
    auth_process_status: AuthStatus;
    user_infos: UserInfos;
}

export interface ContractInformations {
    abi: any;
    runtime_binary: string;
    address: string;
}

export interface ContractsStore {
    [key: string]: ContractInformations;
}

export interface RemoteSettingsSection {
    node_host: string;
    node_port: number;
    node_connection_protocol: string;
    contracts: ContractsStore;
}

export interface CustomState {
    local_settings: LocalSettingsSection;
    remote_settings: RemoteSettingsSection;
    app: AppSection;
    lwtx: LWTransactionsSection;
    strapi_cache: StrapiCacheSection;
}

export type AppState = CustomState & State;

export const InitialAppState: AppState = {
    lwtx: {
        attempts: []
    },
    strapi_cache: {
        height: 0,
        fragments: {},
        calls: {}
    },
    local_settings: {
        device: null,
        theme: null
    },
    remote_settings: {
        node_host: null,
        node_port: null,
        node_connection_protocol: null,
        contracts: {}
    },
    app: {
        t721_wallet: {
            private_key: undefined,
            status: LocalWalletStatus.None,
            period: null,
            address: null
        },
        auth_process_status: AuthStatus.None,
        ready: {
            local_settings: false,
            remote_settings: false,
            app: false
        },
        user_infos: null,
        provider: null,
        status: AppStatus.Loading,
        strapi: null,
        config: {
            strapi_endpoint: null,
            google_api_token: null
        },
        token: undefined
    }
};
