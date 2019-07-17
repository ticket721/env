import { StrapiAddress } from '@utils/strapi/address';
import * as React        from 'react';
import { Tabs }          from 'antd';
import AccountSettings   from './AccountSettings';

const TabPane = Tabs.TabPane;

export const TabGetter = (strapi_address: StrapiAddress, address: string, coinbase: string, t: any): React.ReactNode[] => {
    const ret: React.ReactNode[] = [];

    if (address === coinbase || address === undefined) {
        ret.push(
            <TabPane tab={t('account_tabs_settings')} key='settings'>
                <AccountSettings strapi_address={strapi_address} address={address} coinbase={coinbase}/>
            </TabPane>
        );
    }

    return ret;
};
