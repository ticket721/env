import * as React                                         from 'react';
import { SyntheticEvent }                                 from 'react';
import { StrapiAddress }                                  from '@utils/strapi/address';
import { Button, Card, Input, message, Spin, Typography } from 'antd';
import { I18N, I18NProps }                                from '@utils/misc/i18n';
import { HandleGetter }                 from '../misc/HandleGetter';
import { AppState, WalletProviderType } from '@utils/redux/app_state';
import { connect }                      from 'react-redux';
import { sign }                         from '@utils/misc/Web3TypedSignature';
import Strapi                           from 'strapi-sdk-javascript';
import { Dispatch }                     from 'redux';
import { StrapiHelper }                 from '@utils/StrapiHelper';
import { theme }                        from '../../../utils/theme';
import { RGA }                          from '../../../utils/misc/ga';

export interface UsernameFormProps {
    strapi_address: StrapiAddress;
    address: string;
    coinbase: string;
}

interface UsernameFormState {
    new_username: string;
    old_username: string;
    loading: boolean;
}

interface UsernameFormRState {
    web3: any;
    strapi: Strapi;
    provider: WalletProviderType;
}

interface UsernameFormRDispatch {
    resetCoinbase: () => void;
}

type MergedUsernameFormProps = UsernameFormProps & I18NProps & UsernameFormRState & UsernameFormRDispatch;

class UsernameForm extends React.Component<MergedUsernameFormProps, UsernameFormState> {

    constructor(props: MergedUsernameFormProps) {
        super(props);

        const handle = HandleGetter(this.props.strapi_address, this.props.address, this.props.coinbase);

        if (handle[1] === true) {
            this.state = {
                new_username: handle[0],
                old_username: handle[0],
                loading: false
            };
        } else {
            this.state = {
                new_username: undefined,
                old_username: undefined,
                loading: false
            };
        }
    }

    shouldComponentUpdate(nextProps: Readonly<UsernameFormProps & I18NProps & UsernameFormRState & UsernameFormRDispatch>, nextState: Readonly<UsernameFormState>, nextContext: any): boolean {
        if (nextProps.strapi_address && nextProps.strapi_address.username !== nextState.old_username) {
            this.setState({
                old_username: nextProps.strapi_address.username
            });
        }
        return true;
    }

    on_change = (e: SyntheticEvent): void => {
        this.setState({
            new_username: (e.target as any).value
        });
    }

    on_submit = (): void => {
        if (this.valid()) {
            this.setState({
                loading: true
            });

            RGA.event({
                category: 'User',
                action: 'Username Edition Request'
            });
            sign(this.props.web3, this.props.coinbase, [
                    {
                        type: 'string',
                        name: 'username',
                        value: this.state.new_username
                    }
                ]
            ).then(async (res: any): Promise<void> => {
                try {
                    await this.props.strapi.updateEntry('addresses', this.props.strapi_address.id.toString(), {
                        body: res.payload,
                        signature: res.result
                    });

                    this.setState({
                        loading: false
                    });

                    message.config({
                        top: 10,
                        duration: 2,
                        maxCount: 3,
                    });
                    message.success(this.props.t('settings_username_upload_success'));
                    RGA.event({
                        category: 'User',
                        action: 'Succesful Username Edition'
                    });

                    this.props.resetCoinbase();

                } catch (e) {
                    this.setState({
                        loading: false
                    });
                    message.config({
                        top: 10,
                        duration: 2,
                        maxCount: 3,
                    });
                    RGA.event({
                        category: 'User',
                        action: 'Username Edition Error',
                        value: 5
                    });
                    message.error(this.props.t('settings_username_upload_error'));
                }
            }).catch((e: Error): void => {
                this.setState({
                    loading: false
                });
                message.config({
                    top: 10,
                    duration: 2,
                    maxCount: 3,
                });
                RGA.event({
                    category: 'User',
                    action: 'Username Edition Error',
                    value: 5
                });
                message.error(this.props.t('settings_username_upload_error'));
            });
        }
    }

    valid = (): boolean =>
        (this.state.new_username && this.state.new_username !== this.state.old_username)

    render(): React.ReactNode {
        if (!this.props.strapi_address) {
            return <Card title={this.props.t('settings_username_title')}>
                <div style={{textAlign: 'center'}}>
                    <Typography.Text style={{fontSize: 16}}>{this.props.t('settings_username_no_activity')}</Typography.Text>
                </div>
            </Card>;
        } else {

            const handle = HandleGetter(this.props.strapi_address, this.props.address, this.props.coinbase);

            return <div id='username'>
                <style>{`
                    #username .ant-card-head {
                        background-color: ${theme.dark2};
                    }
                    
                    #username .ant-card-head-title {
                        color: ${theme.white};
                    }
                `}</style>
                <Card title={this.props.t('settings_username_title')}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={{textAlign: 'center'}}>
                            <Typography.Text style={{fontSize: 16, color: theme.dark2}}>{this.props.t(handle[1] ? 'settings_username_preview' : 'settings_username_preview_no_username')}</Typography.Text>
                            <br/>
                            <br/>
                            <Typography.Text style={{fontSize: 24, fontWeight: 400, color: theme.dark2}}>{handle[0]}</Typography.Text>
                            <br/>
                            <br/>
                            {
                                this.state.loading
                                    ?
                                    <Spin/>
                                    :
                                    <div>
                                        <Typography.Text
                                            style={{fontSize: 16, color: theme.dark2}}
                                        >
                                            {this.props.t('settings_username_set_new')}
                                        </Typography.Text>
                                        <br/>
                                        <br/>
                                        <div style={{textAlign: 'center'}}>
                                            <Input style={{width: '60%'}} placeholder={this.props.t('settings_username_set_new_placeholder')} value={this.state.new_username} onChange={this.on_change}/>
                                            <Button
                                                type='primary'
                                                style={{
                                                    marginLeft: 24,
                                                    width: '30%'
                                                }}
                                                disabled={!this.valid()}
                                                onClick={this.on_submit}
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                        {
                                            this.props.provider === WalletProviderType.T721Provider

                                                ?
                                                <div>
                                                    <br/>
                                                    <Typography.Text type='warning' style={{fontSize: 12, color: theme.dark2}}>{this.props.t('settings_username_no_login_change')}</Typography.Text>
                                                    <br/>
                                                </div>

                                                :
                                                null
                                        }
                                    </div>
                            }

                        </div>
                    </div>
                </Card>
            </div>;
        }
    }
}

const mapStateToProps = (state: AppState): UsernameFormRState => ({
    web3: state.vtxconfig.web3,
    strapi: state.app.strapi,
    provider: state.app.provider
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: UsernameFormProps): UsernameFormRDispatch => ({
    resetCoinbase: (): void => StrapiHelper.resetEntries(dispatch, 'addresses', {address: ownProps.strapi_address.address.toLowerCase()})
});

export default I18N.withNamespaces(['account'])(
    connect(mapStateToProps, mapDispatchToProps)(UsernameForm)
) as React.ComponentType<UsernameFormProps>;
