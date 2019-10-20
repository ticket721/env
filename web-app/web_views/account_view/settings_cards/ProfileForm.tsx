import * as React                                         from 'react';
import { SyntheticEvent }                                 from 'react';
import { Button, Card, Input, message, Spin, Typography } from 'antd';
import { I18N, I18NProps }              from '@utils/misc/i18n';
import { AppState, WalletProviderType } from '@utils/redux/app_state';
import { connect }                      from 'react-redux';
import Strapi                           from 'strapi-sdk-javascript';
import { Dispatch }                     from 'redux';
import { StrapiHelper }                 from '@utils/StrapiHelper';
import { theme }                        from '../../../utils/theme';
import { RGA }                          from '../../../utils/misc/ga';
import { UpdateUserInfos }              from '../../../utils/redux/app/actions';

export interface ProfileFormProps {
    firstName: string;
    lastName: string;
}

interface ProfileFormState {
    new_firstName: string;
    new_lastName: string;
    old_firstName: string;
    old_lastName: string;
    loading: boolean;
}

interface ProfileFormRState {
    web3: any;
    strapi: Strapi;
    provider: WalletProviderType;
}

interface ProfileFormRDispatch {
    updateUserInfos: (firstName: string, lastName: string) => void;
}

type MergedProfileFormProps = ProfileFormProps & I18NProps & ProfileFormRState & ProfileFormRDispatch;

class ProfileForm extends React.Component<MergedProfileFormProps, ProfileFormState> {

    constructor(props: MergedProfileFormProps) {
        super(props);

        this.state = {
            new_firstName: this.props.firstName,
            new_lastName: this.props.lastName,
            old_firstName: this.props.firstName,
            old_lastName: this.props.lastName,
            loading: false
        };

    }

    shouldComponentUpdate(nextProps: Readonly<ProfileFormProps & I18NProps & ProfileFormRState & ProfileFormRDispatch>, nextState: Readonly<ProfileFormState>, nextContext: any): boolean {
        if ((nextProps.firstName && nextProps.firstName !== nextState.old_firstName) ||
            (nextProps.lastName && nextProps.lastName !== nextState.old_lastName)) {
            this.setState({
                old_firstName: nextProps.firstName,
                old_lastName: nextProps.lastName
            });
        }
        return true;
    }

    on_firstName_change = (e: SyntheticEvent): void => {
        this.setState({
            new_firstName: (e.target as any).value
        });
    }

    on_lastName_change = (e: SyntheticEvent): void => {
        this.setState({
            new_lastName: (e.target as any).value
        });
    }

    on_submit = (): void => {
        if (this.valid()) {
            RGA.event({
                category: 'User',
                action: 'Username Edition Request'
            });

            this.props.updateUserInfos(this.state.new_firstName, this.state.new_lastName);
            //this.setState({
            //    loading: false
            //});
            //message.config({
            //    top: 10,
            //    duration: 2,
            //    maxCount: 3,
            //});
            //RGA.event({
            //    category: 'User',
            //    action: 'Username Edition Error',
            //    value: 5
            //});
            //message.error(this.props.t('settings_username_upload_error'));
        }
    }

    valid = (): boolean =>
        (this.state.new_firstName && this.state.new_firstName !== this.state.old_firstName) ||
        (this.state.new_lastName && this.state.new_lastName !== this.state.old_lastName)

    render(): React.ReactNode {

        return <div id='profile'>
            <style>{`
                    #profile .ant-card-head {
                        background-color: ${theme.dark2};
                    }
                    
                    #profile .ant-card-head-title {
                        color: ${theme.white};
                    }
                `}</style>
            <Card title={this.props.t('profile_title')}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{width: '100%'}}>
                        {
                            this.state.loading
                                ?
                                <Spin/>
                                :
                                <div style={{width: '100%'}}>
                                    <div style={{width: '100%', textAlign: 'center'}}>
                                        <Typography.Text
                                            style={{fontSize: 16, color: theme.dark2}}
                                        >
                                            {this.props.t('profile_edit')}
                                        </Typography.Text>
                                    </div>
                                    <br/>
                                    <br/>
                                    <Typography.Text
                                        style={{fontSize: 12, color: theme.dark2}}
                                    >
                                        {this.props.t('profile_firstName_title')}
                                    </Typography.Text>
                                    <div style={{width: '100%', textAlign: 'center', marginTop: 12}}>
                                        <Input style={{width: '90%'}} placeholder={this.props.t('profile_firstName_set_new_placeholder')} value={this.state.new_firstName} onChange={this.on_firstName_change}/>
                                    </div>
                                    <br/>
                                    <Typography.Text
                                        style={{fontSize: 12, color: theme.dark2}}
                                    >
                                        {this.props.t('profile_lastName_title')}
                                    </Typography.Text>
                                    <div style={{width: '100%', textAlign: 'center', marginTop: 12}}>
                                        <Input style={{width: '90%'}} placeholder={this.props.t('profile_lastName_set_new_placeholder')} value={this.state.new_lastName} onChange={this.on_lastName_change}/>
                                    </div>
                                    <br/>
                                    <div style={{width: '100%', textAlign: 'center'}}>
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

const mapStateToProps = (state: AppState): ProfileFormRState => ({
    web3: state.vtxconfig.web3,
    strapi: state.app.strapi,
    provider: state.app.provider
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: ProfileFormProps): ProfileFormRDispatch => ({
    updateUserInfos: (firstName: string, lastName: string): void => void dispatch(UpdateUserInfos(firstName, lastName))
});

export default I18N.withNamespaces(['account'])(
    connect(mapStateToProps, mapDispatchToProps)(ProfileForm)
) as React.ComponentType<ProfileFormProps>;
