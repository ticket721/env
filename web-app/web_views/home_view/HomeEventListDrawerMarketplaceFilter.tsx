import { I18N, I18NProps }            from '../../utils/misc/i18n';
import * as React                     from 'react';
import { Switch, Typography } from 'antd';
import { theme }                      from '../../utils/theme';

export interface HomeEventListDrawerMarketplaceFilterProps {
    current: boolean;
    set_marketplace: (marketplace: boolean) => void;
}

type MergedHomeEventListDrawerMarketplaceFilterProps = HomeEventListDrawerMarketplaceFilterProps & I18NProps;

class HomeEventListDrawerMarketplaceFilter extends React.Component<MergedHomeEventListDrawerMarketplaceFilterProps> {
    render(): React.ReactNode {
        return <div style={{display: 'flex', alignItems: 'center'}}>
            <Switch checked={this.props.current} onChange={this.props.set_marketplace} style={{marginRight: 24}}/>
            <Typography.Text style={{color: theme.white, fontSize: 18}}>{this.props.t('homepage_marketplace_filter_title')}</Typography.Text>
        </div>;
    }
}

export default I18N.withNamespaces(['home'])(HomeEventListDrawerMarketplaceFilter) as React.ComponentType<HomeEventListDrawerMarketplaceFilterProps>;
