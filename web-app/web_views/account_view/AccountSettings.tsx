import * as React        from 'react';
import { Col, Row }      from 'antd';
import UsernameForm      from './settings_cards/UsernameForm';
import { StrapiAddress } from '@utils/strapi/address';
import CompanionForm     from './settings_cards/CompanionForm';
import { UserInfos }     from '../../utils/redux/app_state';
import ProfileForm       from './settings_cards/ProfileForm';

export interface AccountSettingsProps {
    strapi_address: StrapiAddress;
    address: string;
    coinbase: string;
    user_infos: UserInfos;
}

export default class AccountSettings extends React.Component<AccountSettingsProps> {
    render(): React.ReactNode {
        return <div style={{padding: 24}}>
            <Row gutter={16}>
                <Col span={8}>
                    <UsernameForm strapi_address={this.props.strapi_address} address={this.props.address} coinbase={this.props.coinbase}/>
                </Col>
                <Col span={8}>
                    <CompanionForm strapi_address={this.props.strapi_address} address={this.props.address} coinbase={this.props.coinbase}/>
                </Col>
                {
                    this.props.user_infos !== null

                        ?
                        <Col span={8}>
                            <ProfileForm firstName={this.props.user_infos.firstName} lastName={this.props.user_infos.lastName}/>
                        </Col>

                        :
                        null
                }
            </Row>
        </div>;
    }
}
