import * as React         from 'react';
import { Col, Row }       from 'antd';
import UsernameForm       from './settings_cards/UsernameForm';
import { StrapiAddress }  from '@utils/strapi/address';

export interface AccountSettingsProps {
    strapi_address: StrapiAddress;
    address: string;
    coinbase: string;
}

export default class AccountSettings extends React.Component<AccountSettingsProps> {
    render(): React.ReactNode {
        return <div style={{padding: 24}}>
            <Row gutter={16}>
                <Col span={8}>
                    <UsernameForm strapi_address={this.props.strapi_address} address={this.props.address} coinbase={this.props.coinbase}/>
                </Col>
            </Row>
        </div>;
    }
}
