import * as React                           from 'react';
import { I18N, I18NProps }                  from '../../utils/misc/i18n';
import { theme }                            from '../../utils/theme';
import { Button, Divider, Typography }      from 'antd';
import HomeEventListDrawerMarketplaceFilter from './HomeEventListDrawerMarketplaceFilter';

export interface HomeEventListFilters {
    filter: {
        marketplace: boolean
    };
    sort: {
        method: string
    };
}

export interface HomeEventListDrawerContentProps {
    filters: HomeEventListFilters;
    set_filter: (field: string, value: any) => void;
    set_sort: (field: string, value: any) => void;
    apply_filters: () => void;
    close: () => void;
}

type MergedHomeEventListDrawerContentProps = HomeEventListDrawerContentProps & I18NProps;

class HomeEventListDrawerContent extends React.Component<MergedHomeEventListDrawerContentProps> {

    apply = (): void => {
        this.props.apply_filters();
        this.props.close();
    }

    render(): React.ReactNode {
        return <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography.Text style={{color: theme.primary, fontSize: 32}}>{this.props.t('homepage_drawer_filter_title')}</Typography.Text>
            <div style={{marginLeft: 24}}>
                <HomeEventListDrawerMarketplaceFilter current={this.props.filters.filter.marketplace} set_marketplace={this.props.set_filter.bind(this, 'marketplace')}/>
            </div>
            <Divider style={{backgroundColor: theme.primary}}/>
            <Button onClick={this.apply} style={{width: 100}} type='primary'>{this.props.t('homepage_drawer_apply_filter_button')}</Button>
        </div>;
    }
}

export default I18N.withNamespaces(['home'])(HomeEventListDrawerContent) as React.ComponentType<HomeEventListDrawerContentProps>;
