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

export interface CompanionFormProps {
    strapi_address: StrapiAddress;
    address: string;
    coinbase: string;
}

interface CompanionFormState {
    companion_code: string;
    loading: boolean;
}

interface CompanionFormRState {
    web3: any;
    strapi: Strapi;
    provider: WalletProviderType;
}

interface CompanionFormRDispatch {
    resetCoinbase: () => void;
}

type MergedCompanionFormProps = CompanionFormProps & I18NProps & CompanionFormRState & CompanionFormRDispatch;

class CompanionForm extends React.Component<MergedCompanionFormProps, CompanionFormState> {

    constructor(props: MergedCompanionFormProps) {
        super(props);

        const handle = HandleGetter(this.props.strapi_address, this.props.address, this.props.coinbase);

        if (handle[1] === true) {
            this.state = {
                companion_code: '',
                loading: false
            };
        } else {
            this.state = {
                companion_code: '',
                loading: false
            };
        }
    }

    on_change = (e: SyntheticEvent): void => {
        this.setState({
            companion_code: (e.target as any).value
        });
    }

    on_submit = (): void => {
        if (this.valid()) {
            this.setState({
                loading: true
            });

            RGA.event({
                category: 'User',
                action: 'Compabion Edition Request'
            });
            sign(this.props.web3, this.props.coinbase, [
                    {
                        type: 'string',
                        name: 'code',
                        value: this.state.companion_code
                    }
                ]
            ).then(async (res: any): Promise<void> => {
                try {
                    await this.props.strapi.request('post', '/addresses/companionlink', {
                        data: {
                            body: res.payload,
                            signature: res.result
                        }
                    });

                    this.setState({
                        loading: false
                    });

                    message.config({
                        top: 10,
                        duration: 2,
                        maxCount: 3,
                    });
                    message.success(this.props.t('settings_companion_upload_success'));
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
                    message.error(this.props.t('settings_companion_upload_error'));
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
                message.error(this.props.t('settings_companion_upload_error'));
            });
        }
    }

    valid = (): boolean =>
        (this.state.companion_code.length === 6)

    render(): React.ReactNode {

        return <div id='companion'>
            <style>{`
                    #companion .ant-card-head {
                        background-color: ${theme.dark2};
                    }
                    
                    #companion .ant-card-head-title {
                        color: ${theme.white};
                    }
                `}</style>
            <Card title={this.props.t('settings_companion_title')}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{textAlign: 'center'}}>
                        {
                            this.props.strapi_address && this.props.strapi_address.linked_companion
                                ?
                                <div>
                                    <Typography.Text style={{fontSize: 16, color: theme.dark2}}>{this.props.t('settings_companion_linked_to')}</Typography.Text>
                                    <br/>
                                    <br/>
                                    <Typography.Text style={{fontSize: 24, fontWeight: 400, color: theme.dark2}}>{this.props.strapi_address ? this.props.strapi_address.linked_companion.device_identifier : null}</Typography.Text>
                                    <br/>
                                    <br/>
                                </div>
                                :
                                <div>
                                    <Typography.Text style={{fontSize: 16, color: theme.dark2}}>{this.props.t('settings_companion_not_linked')}</Typography.Text>
                                    <br/>
                                    <br/>
                                </div>
                        }
                        {
                            this.state.loading
                                ?
                                <Spin/>
                                :
                                <div>
                                    <Typography.Text
                                        style={{fontSize: 16, color: theme.dark2}}
                                    >
                                        {this.props.t('settings_companion_set_new')}
                                    </Typography.Text>
                                    <br/>
                                    <br/>
                                    <div style={{textAlign: 'center'}}>
                                        <Input style={{width: '60%'}} placeholder={this.props.t('settings_companion_set_new_placeholder')} value={this.state.companion_code} onChange={this.on_change}/>
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
                                </div>
                        }

                    </div>
                </div>
            </Card>
        </div>;
    }
}

const mapStateToProps = (state: AppState): CompanionFormRState => ({
    web3: state.vtxconfig.web3,
    strapi: state.app.strapi,
    provider: state.app.provider
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: CompanionFormProps): CompanionFormRDispatch => ({
    resetCoinbase: (): void => StrapiHelper.resetEntries(dispatch, 'addresses', {address: ownProps.strapi_address.address.toLowerCase()})
});

export default I18N.withNamespaces(['account'])(
    connect(mapStateToProps, mapDispatchToProps)(CompanionForm)
) as React.ComponentType<CompanionFormProps>;
