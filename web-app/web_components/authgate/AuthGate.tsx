import * as React                                                                  from 'react';
import { GateProps }                                                               from '@components/gate/Gate';
import { AuthGateStatus, AuthGateStatuses }                                        from './AuthGateStatuses';
import { AuthenticatedPath, AuthLoginPath, AuthNotRequiredPath, AuthRegisterPath } from './AuthGatePaths';
import { AppState, WalletProviderType }                                            from '@utils/redux/app_state';
import { FullPageLoader }                                                          from '@web_components/loaders/FullPageLoader';
import { LoginViewProps }                                                          from '@web_views/auth_view/LoginView';
import { RegisterViewProps }                                                       from '@web_views/auth_view/RegisterView';
import dynamic                                                                     from 'next/dynamic';
import { connect }                                                                 from 'react-redux';

// Dynamic Components

const Gate: React.ComponentType<GateProps> = dynamic<GateProps>(async () => import('@components/gate/Gate'), {
    loading: (): React.ReactElement => null
});
const LoginView = dynamic<LoginViewProps>(async () => import('@web_views/auth_view/LoginView'), {
    loading: (): React.ReactElement => null
});
const RegisterView = dynamic<RegisterViewProps>(async () => import('@web_views/auth_view/RegisterView'), {
    loading: (): React.ReactElement => null
});

// Props

export interface AuthGateProps {
}

interface AuthGateRState {
    provider: WalletProviderType;
    token: string;
}

interface AuthGateState {
    register: boolean;
}

type MergedAuthGateProps = AuthGateProps & AuthGateRState;

/**
 * Used to display Login, Register or App depending on `provider` and `token` values
 */
class AuthGate extends React.Component<MergedAuthGateProps, AuthGateState> {

    state: AuthGateState = {
        register: false
    };

    switchToRegister = (): void => {
        if (!this.state.register) {
            this.setState({
                register: true
            });
        }
    }

    switchToLogin = (): void => {
        if (this.state.register) {
            this.setState({
                register: false
            });
        }
    }

    render(): React.ReactNode {

        let status = null;

        if (this.props.provider !== WalletProviderType.T721Provider) {
            status = AuthGateStatus.AuthNotRequired;
        } else if (this.props.token === undefined) {
            return <FullPageLoader/>;
        } else if (this.props.token === null) {
            status = this.state.register ? AuthGateStatus.AuthRegister : AuthGateStatus.AuthLogin;
        } else {
            status = AuthGateStatus.Authenticated;
        }

        return <Gate status={status} statuses={AuthGateStatuses}>

            <AuthNotRequiredPath>
                {this.props.children}
            </AuthNotRequiredPath>

            <AuthLoginPath>
                <LoginView switch={this.switchToRegister}/>
            </AuthLoginPath>

            <AuthRegisterPath>
                <RegisterView switch={this.switchToLogin}/>
            </AuthRegisterPath>

            <AuthenticatedPath>
                {this.props.children}
            </AuthenticatedPath>
        </Gate>;
    }
}

const mapStateToProps = (state: AppState): AuthGateRState => ({
    provider: state.app.provider,
    token: state.app.token
});

export default connect(mapStateToProps)(AuthGate);
