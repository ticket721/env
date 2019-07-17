import * as React                                          from 'react';
import { Button, Checkbox, Form, Icon, Input, Typography } from 'antd';
import { I18N, I18NProps }      from '@utils/misc/i18n';
import { AppState, AuthStatus } from '@utils/redux/app_state';
import { Dispatch }             from 'redux';
import { Auth }                 from '@utils/redux/app/actions';
import { connect }              from 'react-redux';
import { FormComponentProps }   from 'antd/lib/form';
import { theme }                from '../../utils/theme';
import { RGA }                  from '../../utils/misc/ga';

// Props

export interface LoginFormProps {
    switch: () => void;
}

interface LoginFormRState {
    status: AuthStatus;
}

interface LoginFormRDispatch {
    auth: (username: string, password: string, remember: boolean) => void;
}

type MergedLoginFormProps = LoginFormProps & LoginFormRState & LoginFormRDispatch & I18NProps & FormComponentProps;

class LoginForm extends React.Component<MergedLoginFormProps> {
    handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        this.props.form.validateFields((err: Error, values: any) => {
            if (!err) {
                RGA.event({category: 'Login', action: 'Submit Login Credentials'});
                this.props.auth(values.username, values.password, values.remember);
            }
        });
    }

    handleRegister = (): void => {
        this.props.switch!();
    }

    render(): React.ReactNode {
        const {getFieldDecorator}: any = this.props.form;

        let warning = null;

        switch (this.props.status) {
            case AuthStatus.AuthInvalidIdentifierOrPassword:
                warning = <Typography.Text type='danger' style={{color: theme.danger}}>{this.props.t('login_invalid_identifier_or_password')}</Typography.Text>;
                break;
        }

        return <div>
            <style>{`
                .login-form {
                    max-width: 300px;
                }
                .login-form-forgot {
                    float: right;
                }
                .login-form-button {
                    width: 100%;
                }
                `}</style>
            <Form onSubmit={this.handleSubmit} className='login-form'>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: `${this.props.t('please_input_username')}`}],
                    })(
                        <Input
                            prefix={<Icon type='user' style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder={this.props.t('username')}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: `${this.props.t('please_input_password')}`}],
                    })(
                        <Input
                            prefix={<Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type='password'
                            placeholder={this.props.t('password')}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox style={{color: theme.white}}>{this.props.t('remember_me')}</Checkbox>
                    )}
                    <a className='login-form-forgot' href='' style={{color: theme.white}}>{this.props.t('forgot_password')}</a>
                    {warning !== null ? <br/> : null}
                    {warning}
                    <Button loading={this.props.status === AuthStatus.AuthStarted} type='primary' htmlType='submit' className='login-form-button'>
                        {this.props.t('log_in')}
                    </Button>
                    <a onClick={this.handleRegister} style={{color: theme.white}}>{this.props.t('register_now')}</a>
                </Form.Item>
            </Form>
        </div>;
    }
}

const mapStateToProps = (state: AppState): LoginFormRState => ({
    status: state.app.auth_process_status
});
const mapDispatchToProps = (dispatch: Dispatch): LoginFormRDispatch => ({
    auth: (username: string, password: string, remember: boolean): void => {
        dispatch(Auth(username, password, remember));
    }
});

export default Form.create({name: 'login'})(
    I18N.withNamespaces(['auth'])(
        connect(mapStateToProps, mapDispatchToProps)(
            LoginForm
        )
    )
);
