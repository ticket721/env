import * as React                                           from 'react';
import { Button, Drawer, Input, Typography }                from 'antd';
import { I18N, I18NProps }                                  from '../../utils/misc/i18n';
import { theme }                                            from '../../utils/theme';
import HomeEventListFetcher                                 from './HomeEventListFetcher';
import HomeEventListDrawerContent, { HomeEventListFilters } from './HomeEventListDrawerContent';
import { RGA }                                              from '../../utils/misc/ga';

export interface HomeViewProps {

}

type MergedHomeViewProps = HomeViewProps & I18NProps;

interface HomeViewState {
    focused_search: boolean;
    filter_on: boolean;
    live_search_value: string;
    search_value: string;
    live_filters: HomeEventListFilters;
    filters: HomeEventListFilters;
}

class HomeView extends React.Component<MergedHomeViewProps, HomeViewState> {

    state: HomeViewState = {
        focused_search: true,
        filter_on: false,
        search_value: undefined,
        live_search_value: undefined,
        live_filters: {
            filter: {
                marketplace: false
            },
            sort: {
                method: 'start'
            }
        },
        filters: {
            filter: {
                marketplace: false
            },
            sort: {
                method: 'start'
            }
        }
    };

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + window.location.search);
    }

    apply_filters = (): void => {
        this.setState({
            filters: this.state.live_filters
        });
    }

    set_filter = (field: string, value: any): void => {
        this.setState({
            live_filters: {
                ...this.state.live_filters,
                filter: {
                    ...this.state.live_filters.filter,
                    [field]: value
                }
            }
        });
    }

    set_sort = (field: string, value: any): void => {
        this.setState({
            live_filters: {
                ...this.state.live_filters,
                sort: {
                    ...this.state.live_filters.sort,
                    [field]: value
                }
            }
        });
    }

    set_live_search = (e: any): void => {
        this.setState({
            live_search_value: e.target.value !== '' ? e.target.value : undefined
        });
    }

    clear_search = (): void => {
        this.setState({
            search_value: undefined,
            live_search_value: undefined
        });
    }

    set_search = (): void => {
        this.setState({
            search_value: this.state.live_search_value
        });
    }

    open_filter = (): void => {
        this.setState({
            filter_on: true
        });
    }

    close_filter = (): void => {
        this.setState({
            filter_on: false
        });
    }

    set_focus = (): void => {
        this.setState({
            focused_search: true
        });
    }

    set_blur = (): void => {
        this.setState({
            focused_search: false
        });
    }

    render(): React.ReactNode {

        const placeholder = 'air guitar concert';

        return <div style={{padding: 12}}>
            <div id='home_content' style={{margin: 12, padding: 24, display: 'flex', flexDirection: 'column', background: `linear-gradient(to right, ${theme.dark1}, ${theme.primarydark0})`, width: 600, borderRadius: 5, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'}}>
                <Typography.Text style={{color: theme.white, fontSize: 32}}>{this.props.t('homepage_title')}</Typography.Text>
                <div id='event_name_input' style={{marginLeft: 24, marginRight: 24, marginTop: 12}}>
                    <style>{`
                        #event_name_input .ant-input {
                            background-color: transparent;
                            border: none;
                            font-size: 50px;
                            font-weight: 300;
                            color: ${theme.primary};
                            height: auto;
                            float: left;
                        }
                        
                        #event_name_input .ant-input::placeholder {
                            color: ${theme.primary};
                            opacity: 0.25;
                            font-weight: 300;
                        }
                        
                        #event_name_input .ant-input:focus {
                            box-shadow: none;
                        }
                        
                        #event_name_input input {
                            background-color: transparent;
                            outline: none;
                            caret-color: ${theme.white};
                        }
                        
                    `}</style>
                    <Input
                        placeholder={this.state.focused_search ? undefined : placeholder}
                        onFocus={this.set_focus}
                        onBlur={this.set_blur}
                        onChange={this.set_live_search}
                        onPressEnter={this.set_search}
                        value={this.state.live_search_value}
                        autoFocus={true}
                    />
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12, width: 600 - 48}}>
                    <Button type='primary' style={{margin: 12}} onClick={this.set_search}>{this.props.t('homepage_search_events_button')}</Button>
                    <Button type='danger' disabled={this.state.search_value === undefined} style={{margin: 12}} onClick={this.clear_search}>{this.props.t('homepage_clear_search_button')}</Button>
                    <Button style={{margin: 12}} onClick={this.open_filter}>{this.props.t('homepage_more_filters_button')}</Button>
                </div>
            </div>
            <HomeEventListFetcher
                name={this.state.search_value}
                filters={this.state.filters}
            />
            <style>{`
                .homepage_filters .ant-drawer-content {
                    background: linear-gradient(to right, ${theme.primarydark0}, ${theme.primarydark1});
                }
                
                .homepage_filters .ant-drawer-close {
                    color: ${theme.primary};
                }
            `}</style>
            <Drawer
                className={'homepage_filters'}
                placement={'right'}
                closable={true}
                onClose={this.close_filter}
                visible={this.state.filter_on}
                width={500}
            >
                <HomeEventListDrawerContent
                    filters={this.state.live_filters}
                    set_filter={this.set_filter}
                    set_sort={this.set_sort}
                    apply_filters={this.apply_filters}
                    close={this.close_filter}
                />
            </Drawer>
        </div>;
    }
}

export default I18N.withNamespaces(['home'])(HomeView) as React.ComponentType<HomeViewProps>;
