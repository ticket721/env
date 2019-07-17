import {
    Form, Icon, Input, Button, Typography
}                                from 'antd';
import * as React                from 'react';
import { TemporaryWallet }       from './LocalWalletCreationView';
import * as PasswordValidator    from 'password-validator';
import { AppState }              from '@utils/redux/app_state';
import { Dispatch }              from 'redux';
import { SubmitEncryptedWallet } from '@utils/redux/app/actions';
import { connect }               from 'react-redux';
import { I18N, I18NProps }       from '@utils/misc/i18n';
import { FormComponentProps }    from 'antd/lib/form';
import { RGA }                   from '../../utils/misc/ga';

const PasswordSchema = new PasswordValidator();

PasswordSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .has().symbols();

function hasErrors(fieldsError: any): any {
    return Object.keys(fieldsError).some((field: any) => fieldsError[field]);
}

export interface HorizontalLockFormProps {
    wallet_infos: TemporaryWallet;
}

interface HorizontalLockFormRState {

}

interface HorizontalLockFormRDispatch {
    submit: (encrypted_wallet: string) => void;
}

type MergedHorizontalLockFormProps = HorizontalLockFormProps & HorizontalLockFormRState & HorizontalLockFormRDispatch & I18NProps & FormComponentProps;

enum WalletCreationStatus {
    Ok = 0,
    Encrypting,
    Sent
}

export interface HorizontalLockFormState {
    status: WalletCreationStatus;
    errors: string[];
    error_messages: any;
}

class HorizontalLockForm extends React.Component<MergedHorizontalLockFormProps, HorizontalLockFormState> {

    constructor(props: MergedHorizontalLockFormProps) {
        super(props);

        this.state = {
            status: WalletCreationStatus.Ok,
            errors: [],
            error_messages: {
                'not_same': this.props.t('input_error_not_same'),
                'min': this.props.t('input_error_min'),
                'max': this.props.t('input_error_max'),
                'uppercase': this.props.t('input_error_uppercase'),
                'lowercase': this.props.t('input_error_lowercase'),
                'digits': this.props.t('input_error_digits'),
                'symbols': this.props.t('input_error_symbols'),
                'spaces': this.props.t('input_error_spaces')
            }
        };
    }

    componentDidMount(): void {
        this.props.form.validateFields((): void => {
        });
    }

    handleSubmit = (e: any): void => {
        e.preventDefault();
        this.setState({
            status: WalletCreationStatus.Encrypting,
            errors: []
        });
        setTimeout(() => {
            this.props.form.validateFields((err: Error, values: any) => {
                if (!err) {
                    if (values.password !== values.password_verify) {
                        return this.setState({
                            status: WalletCreationStatus.Ok,
                            errors: ['not_same']
                        });
                    }
                    const errors = PasswordSchema.validate(values.password, {list: true});
                    if (errors.length) {
                        return this.setState({
                            status: WalletCreationStatus.Ok,
                            errors
                        });
                    }
                    const encrypted_wallet = this.props.wallet_infos.wallet.toV3(values.password);
                    this.props.submit(JSON.stringify(encrypted_wallet));
                    RGA.event({category: 'T721 Wallet', action: 'New Wallet Submitted'});
                    this.setState({
                        status: WalletCreationStatus.Sent
                    });
                }
            });
        }, 200);
    }

    gen_err(): React.ReactElement[] {
        if (this.state.errors.length === 0) return null;
        const res: React.ReactElement[] = [
            (<br/>),
            (<ul/>)
        ];

        for (const err of this.state.errors) {
            res.push(
                <li key={err}>
                    <Typography.Text type='danger'>{this.state.error_messages[err]}</Typography.Text>
                </li>
            );
        }

        res.push(<ul/>);

        return res;
    }

    render(): React.ReactNode {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        }: any = this.props.form;

        // Only show error after a field is touched.
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const passwordVerifyError = isFieldTouched('password_verify') && getFieldError('password_verify');
        return (
            <Form layout='inline' onSubmit={this.handleSubmit}>
                <Form.Item
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: this.props.t('password_please_input')}],
                    })(
                        <Input prefix={<Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}}/>} type='password' placeholder={this.props.t('password_placeholder')}/>
                    )}
                </Form.Item>
                <Form.Item
                    validateStatus={passwordVerifyError ? 'error' : ''}
                    help={passwordVerifyError || ''}
                >
                    {getFieldDecorator('password_verify', {
                        rules: [{required: true, message: this.props.t('password_verify_please_input')}],
                    })(
                        <Input prefix={<Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}}/>} type='password' placeholder={this.props.t('password_verify_placeholder')}/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        loading={this.props.wallet_infos.wallet === null || this.state.status === WalletCreationStatus.Encrypting}
                        disabled={hasErrors(getFieldsError()) || this.props.wallet_infos.wallet === null || this.state.status === WalletCreationStatus.Encrypting}
                    >
                        {this.props.t('lock_it')}
                    </Button>
                </Form.Item>
                {this.gen_err()}
            </Form>
        );
    }
}

const mapStateToProps = (state: AppState): HorizontalLockFormRState => ({});
const mapDispatchToProps = (dispatch: Dispatch): HorizontalLockFormRDispatch => ({
    submit: (encrypted_wallet: string): void => {
        dispatch(SubmitEncryptedWallet(encrypted_wallet));
    }
});

export default (Form.create({name: 'lock'})(
    I18N.withNamespaces(['local_wallet_creation'])(
        connect(mapStateToProps, mapDispatchToProps)(
            HorizontalLockForm
        ) as React.ComponentClass<any>
    )
) as any) as React.ComponentType<HorizontalLockFormProps>;
