export enum AuthGateStatus {
    AuthNotRequired = 0,
    AuthLogin,
    AuthRegister,
    Authenticated
}

export const AuthGateStatuses: string[] = [
    'AuthNotRequired',
    'AuthLogin',
    'AuthRegister',
    'Authenticated'
];
